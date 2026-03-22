import { createOpenAIClient, getModelConfig, hasModelConfig } from '@/lib/visibility-audit/llm';
import {
  extractJsonObject,
  platformLabels,
  type AuditResult,
  type IntakeForm,
  type Locale,
  type PlatformAnswer,
  type PlatformName,
  type PlatformResult,
} from '@/lib/visibility-audit/shared';
import { type PlatformAuditRawResult } from '@/lib/visibility-audit/platform-audit';

function heuristicCompetitors(text: string, targetName: string) {
  const tokens = text
    .split(/[\s，,。；;、/|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item.length >= 2)
    .filter((item) => item !== targetName);

  const buckets = new Set<string>();
  for (const token of tokens) {
    if (/推荐|预算|问题|平台|如果|因为|以及|可以|就是|目前|用户|适合/.test(token)) continue;
    buckets.add(token);
    if (buckets.size >= 3) break;
  }
  return [...buckets];
}

function buildHeuristicAnswer(raw: { questionId: string; question: string; rawSnippet: string; links: string[] }, form: IntakeForm, locale: Locale): PlatformAnswer {
  const mentionsTarget = raw.rawSnippet.includes(form.name);
  const competitors = heuristicCompetitors(raw.rawSnippet, form.name).slice(0, 3);
  return {
    questionId: raw.questionId,
    question: raw.question,
    rawSnippet: raw.rawSnippet,
    summary:
      locale === 'zh'
        ? mentionsTarget
          ? `回答提到了 ${form.name}，但同时也在强调其他竞品，推荐位并不稳。`
          : `回答没有稳定提到 ${form.name}，更像是在把问题导向其他竞品或泛品类推荐。`
        : mentionsTarget
          ? `The answer mentioned ${form.name}, but the recommendation slot is still shared with competitors.`
          : `The answer did not stably surface ${form.name}; it leaned toward rivals or generic category picks.`,
    mentionsTarget,
    competitors: raw.links.length ? raw.links.slice(0, 3) : competitors,
    riskLevel: mentionsTarget ? 'medium' : 'high',
  };
}

async function summarizeRawAnswersWithModel(form: IntakeForm, locale: Locale, platform: PlatformName, rawAnswers: PlatformAuditRawResult['rawAnswers']) {
  const openai = createOpenAIClient();
  const { model } = getModelConfig();
  const response = await openai!.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: '你是一个严格输出 JSON 的 AI 检测结果分析 Agent。',
      },
      {
        role: 'user',
        content: `请根据以下真实 AI 平台回答，输出 JSON：{"answers":[{"questionId":"","summary":"","mentionsTarget":true,"competitors":[""],"riskLevel":"high"}]}。

要求：
1. 只能输出 JSON。
2. competitors 里优先抽取被推荐的品牌或商品名，若识别不到可留空数组。
3. riskLevel 只能是 high / medium / low。
4. 输出语言为 ${locale === 'zh' ? '中文' : 'English'}。

目标对象：
- 类型：${form.entityType}
- 名称：${form.name}
- 品类：${form.category}
- 价格带：${form.priceBand || '未填写'}
- 卖点：${form.sellingPoints || '未填写'}

平台：${platformLabels[platform][locale]}

回答列表：
${JSON.stringify(rawAnswers, null, 2)}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || '';
  const parsed = extractJsonObject(raw) as { answers?: Array<Record<string, unknown>> } | null;
  return Array.isArray(parsed?.answers) ? parsed!.answers! : [];
}

export async function summarizePlatformResult(rawResult: PlatformAuditRawResult, form: IntakeForm, locale: Locale): Promise<PlatformResult> {
  if (rawResult.status !== 'completed' || rawResult.rawAnswers.length === 0) {
    return {
      platform: rawResult.platform,
      status: rawResult.status,
      completion: 100,
      note: rawResult.note,
      answers: [],
    };
  }

  let modelAnswers: Array<Record<string, unknown>> = [];
  if (hasModelConfig()) {
    try {
      modelAnswers = await summarizeRawAnswersWithModel(form, locale, rawResult.platform, rawResult.rawAnswers);
    } catch {
      modelAnswers = [];
    }
  }

  const answers = rawResult.rawAnswers.map((raw) => {
    const modelAnswer = modelAnswers.find((item) => item.questionId === raw.questionId);
    if (modelAnswer) {
      return {
        questionId: raw.questionId,
        question: raw.question,
        rawSnippet: raw.rawSnippet,
        summary: typeof modelAnswer.summary === 'string' ? modelAnswer.summary : raw.rawSnippet.slice(0, 180),
        mentionsTarget: Boolean(modelAnswer.mentionsTarget),
        competitors: Array.isArray(modelAnswer.competitors)
          ? modelAnswer.competitors.filter((item): item is string => typeof item === 'string').slice(0, 3)
          : raw.links.slice(0, 3),
        riskLevel:
          modelAnswer.riskLevel === 'low' || modelAnswer.riskLevel === 'medium' || modelAnswer.riskLevel === 'high'
            ? modelAnswer.riskLevel
            : 'high',
      } satisfies PlatformAnswer;
    }
    return buildHeuristicAnswer(raw, form, locale);
  });

  return {
    platform: rawResult.platform,
    status: rawResult.status,
    completion: 100,
    note: rawResult.note,
    answers,
  };
}

function buildHeuristicOverall(form: IntakeForm, locale: Locale, platformResults: PlatformResult[]): AuditResult {
  const answers = platformResults.flatMap((item) => item.answers);
  const missingCount = answers.filter((item) => !item.mentionsTarget).length;
  const competitorNames = [...new Set(answers.flatMap((item) => item.competitors).filter(Boolean))].slice(0, 3);
  return {
    headline:
      locale === 'zh'
        ? missingCount > 0
          ? `在高意图问题下，AI 仍更容易把注意力给到 ${competitorNames[0] || '其他竞品'}。`
          : `${form.name} 已经开始被 AI 提及，但稳定推荐优势仍未建立。`
        : missingCount > 0
          ? `Across high-intent prompts, AI still gives more attention to ${competitorNames[0] || 'other rivals'}.`
          : `${form.name} is starting to appear, but it still lacks a stable recommendation lead.`,
    subhead:
      locale === 'zh'
        ? `${form.name} 在 ${form.category || '该品类'} 的部分问题里已有露出，但价格带、人群或场景问题仍可能被竞品占位。`
        : `${form.name} appears in some ${form.category || 'category'} prompts, but rivals still occupy price-band, audience, or scenario queries.`,
    visibilityLevel: missingCount >= 3 ? 'low' : missingCount >= 1 ? 'medium' : 'high',
    keyRisks:
      locale === 'zh'
        ? [
            `未稳定提及目标对象的问题数：${missingCount}`,
            `竞品高频出现：${competitorNames.join('、') || '未识别出稳定竞品名'}`,
            '你的内容信号仍不足以在购买意图问题里形成默认推荐。',
          ]
        : [
            `Prompts missing the target: ${missingCount}`,
            `Recurring competitor names: ${competitorNames.join(', ') || 'No stable rival names extracted'}`,
            'Your content signal is still too weak to own high-intent recommendation slots.',
          ],
    suggestions:
      locale === 'zh'
        ? [
            `优先围绕 ${form.priceBand || '目标价格带'} + ${form.targetAudience || '目标人群'} 生成评测内容。`,
            `让 ${form.name} 与 ${form.sellingPoints || '核心卖点'} 在可检索内容中高频共现。`,
            '补充更强的评测、对比、问答与第三方背书内容。',
          ]
        : [
            `Build comparison content around ${form.priceBand || 'the target price band'} and ${form.targetAudience || 'the target audience'}.`,
            `Increase co-occurrence between ${form.name} and ${form.sellingPoints || 'its key USP'}.`,
            'Add stronger reviews, comparisons, Q&A, and third-party proof content.',
          ],
    platformResults,
  };
}

export async function summarizeAudit(form: IntakeForm, locale: Locale, platformResults: PlatformResult[]): Promise<AuditResult> {
  if (!hasModelConfig()) {
    return buildHeuristicOverall(form, locale, platformResults);
  }

  const openai = createOpenAIClient();
  const { model } = getModelConfig();

  try {
    const response = await openai!.chat.completions.create({
      model,
      temperature: 0.25,
      messages: [
        {
          role: 'system',
          content: '你是一个严格输出 JSON 的 GEO 风险结论 Agent。',
        },
        {
          role: 'user',
          content: `请根据以下多平台 AI 检测结果，输出 JSON：{"headline":"","subhead":"","visibilityLevel":"low","keyRisks":[""],"suggestions":[""]}。

要求：
1. 只能输出 JSON。
2. visibilityLevel 只能是 low / medium / high。
3. keyRisks 输出 3 条。
4. suggestions 输出 3 条。
5. 输出语言为 ${locale === 'zh' ? '中文' : 'English'}。

目标对象：
- 类型：${form.entityType}
- 名称：${form.name}
- 品类：${form.category}
- 价格带：${form.priceBand || '未填写'}
- 目标人群：${form.targetAudience || '未填写'}
- 卖点：${form.sellingPoints || '未填写'}

平台结果：
${JSON.stringify(platformResults, null, 2)}`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || '';
    const parsed = extractJsonObject(raw) as Partial<AuditResult> | null;
    if (!parsed) {
      throw new Error('无法解析模型输出');
    }

    return {
      headline: typeof parsed.headline === 'string' ? parsed.headline : buildHeuristicOverall(form, locale, platformResults).headline,
      subhead: typeof parsed.subhead === 'string' ? parsed.subhead : buildHeuristicOverall(form, locale, platformResults).subhead,
      visibilityLevel:
        parsed.visibilityLevel === 'low' || parsed.visibilityLevel === 'medium' || parsed.visibilityLevel === 'high'
          ? parsed.visibilityLevel
          : buildHeuristicOverall(form, locale, platformResults).visibilityLevel,
      keyRisks: Array.isArray(parsed.keyRisks)
        ? parsed.keyRisks.filter((item): item is string => typeof item === 'string').slice(0, 3)
        : buildHeuristicOverall(form, locale, platformResults).keyRisks,
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.filter((item): item is string => typeof item === 'string').slice(0, 3)
        : buildHeuristicOverall(form, locale, platformResults).suggestions,
      platformResults,
    };
  } catch {
    return buildHeuristicOverall(form, locale, platformResults);
  }
}

