import { createOpenAIClient, getModelConfig, hasModelConfig } from '@/lib/visibility-audit/llm';
import {
  extractJsonObject,
  generateFallbackQuestions,
  type IntakeForm,
  type Locale,
  type QuestionItem,
  type QuestionsResponse,
} from '@/lib/visibility-audit/shared';

function normalizeQuestions(input: unknown, fallback: QuestionItem[]): QuestionItem[] {
  if (!Array.isArray(input)) return fallback;

  const next = input
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const granularity = record.granularity;
      const question = typeof record.question === 'string' ? record.question.trim() : '';
      const intent = typeof record.intent === 'string' ? record.intent.trim() : '';
      const riskFocus = typeof record.riskFocus === 'string' ? record.riskFocus.trim() : '';
      const recommended = typeof record.recommended === 'boolean' ? record.recommended : index < 5;
      if (!question) return null;
      return {
        id: typeof record.id === 'string' && record.id ? record.id : `q_${index + 1}`,
        granularity: granularity === 'coarse' || granularity === 'medium' || granularity === 'fine' ? granularity : fallback[index]?.granularity || 'medium',
        question,
        intent: intent || fallback[index]?.intent || '',
        riskFocus: riskFocus || fallback[index]?.riskFocus || '',
        recommended,
      } satisfies QuestionItem;
    })
    .filter(Boolean) as QuestionItem[];

  return next.length >= 6 ? next.slice(0, 10) : fallback;
}

function buildPrompt(form: IntakeForm, locale: Locale) {
  const language = locale === 'zh' ? '中文' : 'English';
  const detailBlock =
    form.entityType === 'brand'
      ? `用户输入：
- 类型：品牌
- 名称：${form.name || '未填写'}
- 所属行业：${form.industry || '未填写'}
- 企业类型：${form.companyType || '未填写'}
- 官网：${form.url || '未填写'}
- 品牌定位：${form.brandPositioning || '未填写'}
- 核心业务：${form.coreOfferings || '未填写'}
- 目标人群：${form.targetAudience || '未填写'}
- 市场：${form.market || '未填写'}
- 补充说明：${form.notes || '未填写'}`
      : `用户输入：
- 类型：商品
- 名称：${form.name || '未填写'}
- 品类：${form.category || '未填写'}
- 链接：${form.url || '未填写'}
- 价格带：${form.priceBand || '未填写'}
- 核心卖点：${form.sellingPoints || '未填写'}
- 目标人群：${form.targetAudience || '未填写'}
- 市场：${form.market || '未填写'}
- 补充说明：${form.notes || '未填写'}`;

  return `你是一个严谨的 GEO 问题设计 Agent。请围绕用户提供的品牌或商品信息，输出 10 个用于 AI 可见度检测的问题。

输出要求：
1. 只能输出 JSON，不要输出任何额外解释。
2. JSON 结构必须为 {"questions": [...]}。
3. questions 数组内每项必须包含：id, granularity, question, intent, riskFocus, recommended。
4. granularity 只能是 coarse / medium / fine。
5. 问题总数固定 10 个，其中 coarse 2 个，medium 4 个，fine 4 个。
6. 问题必须像真实用户会问的问题，不能写成内部评估语句。
7. coarse 和 medium 优先不直接点名目标品牌或商品全名；fine 可以更具体。
8. 问题要覆盖：品类发现、价格带、人群、场景、具体识别。
9. 如果类型是品牌，问题结构应更偏向行业、品牌定位、核心业务、企业类型和目标客群；不要生硬套用商品字段。
9. 输出语言为${language}。

${detailBlock}
`;
}

export async function generateQuestions(form: IntakeForm, locale: Locale): Promise<QuestionsResponse> {
  const fallback = generateFallbackQuestions(form, locale);
  if (!hasModelConfig()) {
    return {
      mode: 'fallback',
      questions: fallback,
      warning: '缺少 OPENAI_API_KEY，已使用本地规则问题生成。',
    };
  }

  const openai = createOpenAIClient();
  const { model } = getModelConfig();

  try {
    const response = await openai!.chat.completions.create({
      model,
      temperature: 0.35,
      messages: [
        {
          role: 'system',
          content: '你是一个严格输出 JSON 的 GEO 问题设计 Agent。',
        },
        {
          role: 'user',
          content: buildPrompt(form, locale),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || '';
    const parsed = extractJsonObject(raw) as { questions?: unknown } | null;
    const questions = normalizeQuestions(parsed?.questions, fallback);
    return { mode: 'generated', questions };
  } catch (error) {
    return {
      mode: 'fallback',
      questions: fallback,
      warning: error instanceof Error ? error.message : '问题生成失败，已使用本地规则回退。',
    };
  }
}
