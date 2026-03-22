export type Locale = 'zh' | 'en';
export type EntityType = 'product' | 'brand';
export type Granularity = 'coarse' | 'medium' | 'fine';
export type PlatformName = 'doubao' | 'kimi' | 'deepseek';
export type AuditStage = 'intake' | 'question_loading' | 'questions' | 'audit_running' | 'results';
export type AuditVisibilityLevel = 'low' | 'medium' | 'high';
export type PlatformAuditStatus = 'pending' | 'running' | 'completed' | 'blocked' | 'error';

export type IntakeForm = {
  entityType: EntityType;
  name: string;
  category: string;
  industry: string;
  companyType: string;
  url: string;
  priceBand: string;
  sellingPoints: string;
  brandPositioning: string;
  coreOfferings: string;
  targetAudience: string;
  market: string;
  notes: string;
};

export type QuestionItem = {
  id: string;
  granularity: Granularity;
  question: string;
  intent: string;
  riskFocus: string;
  recommended: boolean;
};

export type PlatformAnswer = {
  questionId: string;
  question: string;
  rawSnippet: string;
  summary: string;
  mentionsTarget: boolean;
  competitors: string[];
  riskLevel: 'high' | 'medium' | 'low';
};

export type PlatformResult = {
  platform: PlatformName;
  status: PlatformAuditStatus;
  completion: number;
  note?: string;
  answers: PlatformAnswer[];
};

export type AuditResult = {
  headline: string;
  subhead: string;
  visibilityLevel: AuditVisibilityLevel;
  keyRisks: string[];
  suggestions: string[];
  platformResults: PlatformResult[];
};

export type QuestionsResponse = {
  mode: 'generated' | 'fallback';
  questions: QuestionItem[];
  warning?: string | null;
};

export type StreamEvent =
  | { type: 'init'; message: string }
  | { type: 'platform_start'; platform: PlatformName; message: string }
  | { type: 'platform_complete'; platform: PlatformName; result: PlatformResult }
  | { type: 'warning'; message: string }
  | { type: 'complete'; result: AuditResult }
  | { type: 'error'; message: string };

export const defaultForm: IntakeForm = {
  entityType: 'product',
  name: '',
  category: '',
  industry: '',
  companyType: '',
  url: '',
  priceBand: '',
  sellingPoints: '',
  brandPositioning: '',
  coreOfferings: '',
  targetAudience: '',
  market: '中国',
  notes: '',
};

export const platformLabels: Record<PlatformName, { zh: string; en: string }> = {
  doubao: { zh: '豆包', en: 'Doubao' },
  kimi: { zh: 'Kimi', en: 'Kimi' },
  deepseek: { zh: 'DeepSeek', en: 'DeepSeek' },
};

const competitorPools = {
  product: {
    zh: ['同价位竞品A', '头部竞品B', '内容占优竞品C'],
    en: ['Competing Product A', 'Category Leader B', 'Content-Heavy Rival C'],
  },
  brand: {
    zh: ['行业头部品牌A', '投放更强品牌B', '高频曝光品牌C'],
    en: ['Market Leader A', 'Aggressive Brand B', 'High-Visibility Brand C'],
  },
};

export function splitSellingPoints(value: string) {
  return value
    .split(/[，,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function generateFallbackQuestions(form: IntakeForm, locale: Locale): QuestionItem[] {
  if (form.entityType === 'brand') {
    return generateBrandFallbackQuestions(form, locale);
  }

  return generateProductFallbackQuestions(form, locale);
}

function generateProductFallbackQuestions(form: IntakeForm, locale: Locale): QuestionItem[] {
  const points = splitSellingPoints(form.sellingPoints);
  const category = form.category || (locale === 'zh' ? '该品类' : 'this category');
  const name = form.name || (locale === 'zh' ? '目标对象' : 'the target offering');
  const audience = form.targetAudience || (locale === 'zh' ? '核心消费人群' : 'the target audience');
  const priceBand = form.priceBand || (locale === 'zh' ? '主流价格带' : 'its price band');
  const pointText = points[0] || (locale === 'zh' ? '核心卖点' : 'key differentiator');

  if (locale === 'zh') {
    return [
      {
        id: 'coarse_1',
        granularity: 'coarse',
        question: `${category}里最近有哪些值得关注的热门选择？`,
        intent: '验证在最宽泛的品类问题下，AI 是否先想到你的目标对象。',
        riskFocus: '若完全不出现，说明基础品类可见度不足。',
        recommended: true,
      },
      {
        id: 'coarse_2',
        granularity: 'coarse',
        question: `${audience}最近在买${category}时最常被推荐什么？`,
        intent: '观察人群导向问题下，AI 优先给谁曝光。',
        riskFocus: '若被固定竞品垄断，说明人群场景内容薄弱。',
        recommended: true,
      },
      {
        id: 'medium_1',
        granularity: 'medium',
        question: `${priceBand}有哪些适合${audience}的${category}？`,
        intent: '验证价格带与人群约束后，目标对象是否进入候选列表。',
        riskFocus: '若未出现，说明高购买意图问题下缺乏曝光。',
        recommended: true,
      },
      {
        id: 'medium_2',
        granularity: 'medium',
        question: `想买主打${pointText}的${category}，现在有哪些更值得考虑的选择？`,
        intent: '观察卖点竞争时，AI 是否更偏向友商表述。',
        riskFocus: '若卖点被竞品抢占，说明差异化心智没有建立。',
        recommended: true,
      },
      {
        id: 'medium_3',
        granularity: 'medium',
        question: `${audience}如果重点考虑${pointText}，会被推荐哪些${category}？`,
        intent: '从特定用户画像和卖点切入检测识别度。',
        riskFocus: '如果只出现竞品，说明内容布局没有击中真实问题。',
        recommended: true,
      },
      {
        id: 'medium_4',
        granularity: 'medium',
        question: `在中国市场，${priceBand}的${category}里谁的口碑和推荐率更高？`,
        intent: '验证市场和价格区间双约束下的推荐格局。',
        riskFocus: '若目标对象缺席，说明市场级信号偏弱。',
        recommended: false,
      },
      {
        id: 'fine_1',
        granularity: 'fine',
        question: `${name}到底值不值得买？`,
        intent: '检测目标对象是否已经能被 AI 明确认出。',
        riskFocus: '若无法识别，说明互联网有效内容可能不足。',
        recommended: true,
      },
      {
        id: 'fine_2',
        granularity: 'fine',
        question: `${name}和同类${category}相比最大的优势是什么？`,
        intent: '检测 AI 是否已经为目标对象形成稳定卖点认知。',
        riskFocus: '若回答模糊，说明品牌叙事尚未固化。',
        recommended: false,
      },
      {
        id: 'fine_3',
        granularity: 'fine',
        question: `${name}适合${audience}吗？`,
        intent: '验证 AI 是否能把目标对象与用户画像正确连接。',
        riskFocus: '若连接不上，说明人群内容还不够充分。',
        recommended: false,
      },
      {
        id: 'fine_4',
        granularity: 'fine',
        question: `${name}在${priceBand}里算什么水平？`,
        intent: '检测目标对象在价格认知层面的相对站位。',
        riskFocus: '若评价失衡，说明价格锚点仍被竞品主导。',
        recommended: false,
      },
    ];
  }

  return [
    {
      id: 'coarse_1',
      granularity: 'coarse',
      question: `What are the most recommended options in ${category} right now?`,
      intent: 'Check whether the target appears in broad category discovery.',
      riskFocus: 'If absent, base-level category visibility is weak.',
      recommended: true,
    },
    {
      id: 'coarse_2',
      granularity: 'coarse',
      question: `What does ${audience} usually get recommended when shopping for ${category}?`,
      intent: 'See which brands own audience-led discovery prompts.',
      riskFocus: 'If rivals dominate, audience positioning is weak.',
      recommended: true,
    },
    {
      id: 'medium_1',
      granularity: 'medium',
      question: `Which ${category} options in ${priceBand} are best for ${audience}?`,
      intent: 'Test whether the target enters shortlist prompts with buying intent.',
      riskFocus: 'Absence means weak visibility in high-intent prompts.',
      recommended: true,
    },
    {
      id: 'medium_2',
      granularity: 'medium',
      question: `Which ${category} choices are best if I care most about ${pointText}?`,
      intent: 'See whether the target owns its key differentiator.',
      riskFocus: 'If rivals absorb the selling point, differentiation is weak.',
      recommended: true,
    },
    {
      id: 'medium_3',
      granularity: 'medium',
      question: `What ${category} would you recommend to ${audience} prioritizing ${pointText}?`,
      intent: 'Blend audience and USP into one prompt.',
      riskFocus: 'If only rivals appear, content is missing real intent coverage.',
      recommended: true,
    },
    {
      id: 'medium_4',
      granularity: 'medium',
      question: `In China, which ${category} brands perform best in ${priceBand}?`,
      intent: 'Test market-plus-priceband competition.',
      riskFocus: 'If absent, market-level authority signals are weak.',
      recommended: false,
    },
    {
      id: 'fine_1',
      granularity: 'fine',
      question: `Is ${name} actually worth buying?`,
      intent: 'Test whether AI can directly recognize the target.',
      riskFocus: 'Failure suggests weak public-web coverage.',
      recommended: true,
    },
    {
      id: 'fine_2',
      granularity: 'fine',
      question: `What makes ${name} stand out against similar ${category} options?`,
      intent: 'Check whether AI has a stable narrative for the target.',
      riskFocus: 'Vague answers suggest weak narrative density.',
      recommended: false,
    },
    {
      id: 'fine_3',
      granularity: 'fine',
      question: `Is ${name} a good fit for ${audience}?`,
      intent: 'Check whether audience matching is understood.',
      riskFocus: 'Weak matching means poor persona relevance.',
      recommended: false,
    },
    {
      id: 'fine_4',
      granularity: 'fine',
      question: `How competitive is ${name} in ${priceBand}?`,
      intent: 'Test price-anchor recognition.',
      riskFocus: 'Skewed answers mean rivals still own the price narrative.',
      recommended: false,
    },
  ];
}

function generateBrandFallbackQuestions(form: IntakeForm, locale: Locale): QuestionItem[] {
  const industry = form.industry || (locale === 'zh' ? '该行业' : 'this industry');
  const name = form.name || (locale === 'zh' ? '目标品牌' : 'the target brand');
  const audience = form.targetAudience || (locale === 'zh' ? '目标客户' : 'the target audience');
  const positioning = form.brandPositioning || (locale === 'zh' ? '差异化定位' : 'brand positioning');
  const offerings = splitSellingPoints(form.coreOfferings || form.sellingPoints);
  const offerText = offerings[0] || (locale === 'zh' ? '核心业务' : 'core offering');
  const companyType = form.companyType || (locale === 'zh' ? '企业类型' : 'company type');

  if (locale === 'zh') {
    return [
      {
        id: 'coarse_1',
        granularity: 'coarse',
        question: `${industry}里最近有哪些值得关注的品牌或公司？`,
        intent: '观察品牌在行业级宽泛问题里的基础露出。',
        riskFocus: '若完全不出现，说明行业级 AI 可见度偏弱。',
        recommended: true,
      },
      {
        id: 'coarse_2',
        granularity: 'coarse',
        question: `${audience}在选择${industry}服务时，最常被推荐哪些品牌？`,
        intent: '观察 AI 在用户需求导向问题里优先推荐谁。',
        riskFocus: '若竞品长期占位，说明用户问题场景未建立。',
        recommended: true,
      },
      {
        id: 'medium_1',
        granularity: 'medium',
        question: `如果重点关注${positioning}，${industry}里有哪些品牌更值得了解？`,
        intent: '检测差异化定位是否已被 AI 感知。',
        riskFocus: '若定位问题仍指向竞品，说明品牌心智未固化。',
        recommended: true,
      },
      {
        id: 'medium_2',
        granularity: 'medium',
        question: `${audience}如果想找主打${offerText}的${companyType}，会被推荐哪些品牌？`,
        intent: '结合人群、业务和企业类型做更高意图检测。',
        riskFocus: '若未出现，说明业务能力与目标人群没有建立关联。',
        recommended: true,
      },
      {
        id: 'medium_3',
        granularity: 'medium',
        question: `中国市场做${industry}的品牌里，谁在${audience}圈层里的口碑更高？`,
        intent: '观察市场和人群双约束下的推荐格局。',
        riskFocus: '若持续缺席，说明市场级内容信号不足。',
        recommended: true,
      },
      {
        id: 'medium_4',
        granularity: 'medium',
        question: `想找偏${positioning}路线的${industry}品牌，现在有哪些可以重点比较？`,
        intent: '检查品牌定位是否能转化为可比较对象。',
        riskFocus: '若 AI 无法把品牌放进比较集，说明内容锚点不清晰。',
        recommended: false,
      },
      {
        id: 'fine_1',
        granularity: 'fine',
        question: `${name}这个品牌怎么样？`,
        intent: '检测品牌名称是否已经被 AI 直接识别。',
        riskFocus: '若无法稳定识别，说明公开网页信息不足。',
        recommended: true,
      },
      {
        id: 'fine_2',
        granularity: 'fine',
        question: `${name}在${industry}里最大的特点是什么？`,
        intent: '看 AI 是否已形成对品牌的稳定认知。',
        riskFocus: '若回答空泛，说明品牌特征尚未沉淀。',
        recommended: false,
      },
      {
        id: 'fine_3',
        granularity: 'fine',
        question: `${name}适合${audience}吗？`,
        intent: '检测品牌与目标客户的匹配是否被理解。',
        riskFocus: '若匹配关系模糊，说明用户导向内容不够。',
        recommended: false,
      },
      {
        id: 'fine_4',
        granularity: 'fine',
        question: `${name}和同类${industry}品牌相比更偏向什么路线？`,
        intent: '检测 AI 是否能把品牌放到竞争语境里定位。',
        riskFocus: '若定位失焦，说明竞品对比内容密度不够。',
        recommended: false,
      },
    ];
  }

  return [
    {
      id: 'coarse_1',
      granularity: 'coarse',
      question: `Which brands or companies are worth watching in ${industry} right now?`,
      intent: 'Check base visibility in broad industry discovery.',
      riskFocus: 'If absent, industry-level AI visibility is weak.',
      recommended: true,
    },
    {
      id: 'coarse_2',
      granularity: 'coarse',
      question: `Which brands does ${audience} usually get recommended in ${industry}?`,
      intent: 'See who owns audience-led brand discovery.',
      riskFocus: 'If rivals dominate, user-intent coverage is weak.',
      recommended: true,
    },
    {
      id: 'medium_1',
      granularity: 'medium',
      question: `Which ${industry} brands stand out if I care about ${positioning}?`,
      intent: 'Test whether the positioning is understood by AI.',
      riskFocus: 'If rivals absorb it, differentiation is weak.',
      recommended: true,
    },
    {
      id: 'medium_2',
      granularity: 'medium',
      question: `What ${companyType} brands focused on ${offerText} are best for ${audience}?`,
      intent: 'Blend audience, company type, and core offering.',
      riskFocus: 'If absent, the brand is not anchored to buying intent.',
      recommended: true,
    },
    {
      id: 'medium_3',
      granularity: 'medium',
      question: `In China, which ${industry} brands have the strongest reputation with ${audience}?`,
      intent: 'Check market-plus-audience recommendation patterns.',
      riskFocus: 'If absent, market-level authority is weak.',
      recommended: true,
    },
    {
      id: 'medium_4',
      granularity: 'medium',
      question: `Which ${industry} brands are most comparable if I want a ${positioning} angle?`,
      intent: 'Test whether AI can place the brand into a comparison set.',
      riskFocus: 'If not, comparison narratives are weak.',
      recommended: false,
    },
    {
      id: 'fine_1',
      granularity: 'fine',
      question: `What is ${name} like as a brand?`,
      intent: 'Check whether AI can directly recognize the brand.',
      riskFocus: 'Weak recognition suggests poor public-web coverage.',
      recommended: true,
    },
    {
      id: 'fine_2',
      granularity: 'fine',
      question: `What makes ${name} stand out in ${industry}?`,
      intent: 'Test whether AI has a stable narrative for the brand.',
      riskFocus: 'Vague answers suggest weak brand identity signals.',
      recommended: false,
    },
    {
      id: 'fine_3',
      granularity: 'fine',
      question: `Is ${name} a good fit for ${audience}?`,
      intent: 'Check whether the brand is connected to the target audience.',
      riskFocus: 'Weak matching means poor audience relevance.',
      recommended: false,
    },
    {
      id: 'fine_4',
      granularity: 'fine',
      question: `How is ${name} positioned against similar ${industry} brands?`,
      intent: 'Test whether AI can place the brand in a competitive frame.',
      riskFocus: 'Blurry positioning means weak comparative content.',
      recommended: false,
    },
  ];
}

export function buildFallbackAuditResult(form: IntakeForm, questions: QuestionItem[], locale: Locale): AuditResult {
  const selected = questions.slice(0, Math.min(3, questions.length));
  const rivals = competitorPools[form.entityType][locale];
  const name = form.name || (locale === 'zh' ? '目标对象' : 'the target');
  const category = form.category || (locale === 'zh' ? '该品类' : 'this category');

  const platformResults: PlatformResult[] = (Object.keys(platformLabels) as PlatformName[]).map((platform, index) => ({
    platform,
    status: 'completed',
    completion: 100,
    note: locale === 'zh' ? '当前为回退生成结果' : 'Fallback-generated result',
    answers: selected.map((question, answerIndex) => ({
      questionId: question.id,
      question: question.question,
      rawSnippet:
        locale === 'zh'
          ? `${platformLabels[platform].zh} 在这个问题下首先提到了 ${rivals[index % rivals.length]}，随后补充了 ${rivals[(index + 1) % rivals.length]}。对 ${name} 只有一笔带过式提及，且没有把 ${form.sellingPoints || '核心卖点'} 说透。`
          : `${platformLabels[platform].en} first surfaced ${rivals[index % rivals.length]}, then expanded on ${rivals[(index + 1) % rivals.length]}. ${name} was mentioned only in passing and its ${form.sellingPoints || 'key differentiators'} were not reinforced.`,
      summary:
        locale === 'zh'
          ? `${platformLabels[platform].zh} 更倾向把这个问题解释成竞品比较，而不是把 ${name} 当成默认答案。`
          : `${platformLabels[platform].en} frames this prompt around rival options rather than treating ${name} as the default answer.`,
      mentionsTarget: answerIndex === 0,
      competitors: [rivals[index % rivals.length], rivals[(index + 1) % rivals.length]],
      riskLevel: answerIndex === 0 ? 'medium' : 'high',
    })),
  }));

  return {
    headline:
      locale === 'zh'
        ? `AI 正在回答这些高意图问题，但它更常推荐 ${rivals[0]} 和 ${rivals[1]}。`
        : `AI is already answering these intent-rich prompts, but it recommends ${rivals[0]} and ${rivals[1]} more often than your offer.`,
    subhead:
      locale === 'zh'
        ? `${name} 在 ${category} 的核心问题里尚未形成稳定的优先推荐心智。`
        : `${name} has not yet built a stable recommendation position in key ${category} prompts.`,
    visibilityLevel: 'low',
    keyRisks:
      locale === 'zh'
        ? [
            `高意图问题下，AI 更容易联想到 ${rivals[0]}。`,
            `你的对象 ${name} 缺少与 ${form.targetAudience || '目标人群'} 相关的稳定推荐语境。`,
            `${form.priceBand || '当前价格带'} 的竞争认知仍被竞品主导。`,
          ]
        : [
            `High-intent prompts still trigger ${rivals[0]} first.`,
            `${name} lacks a stable recommendation context for ${form.targetAudience || 'the target audience'}.`,
            `${form.priceBand || 'The active price band'} is still anchored by competitors.`,
          ],
    suggestions:
      locale === 'zh'
        ? [
            `围绕 ${form.priceBand || '目标价格带'} + ${form.targetAudience || '目标人群'} 布局对比型内容。`,
            `强化 ${name} 与 ${splitSellingPoints(form.sellingPoints)[0] || '核心卖点'} 的共同出现频率。`,
            '优先补齐能被 AI 抓取的权威评测、问答和场景内容。',
          ]
        : [
            `Build comparison-led content around ${form.priceBand || 'the target price band'} and ${form.targetAudience || 'the target audience'}.`,
            `Reinforce co-occurrence between ${name} and ${splitSellingPoints(form.sellingPoints)[0] || 'its main USP'}.`,
            'Prioritize authoritative review, Q&A, and scenario content that AI can index.',
          ],
    platformResults,
  };
}

export function stripCodeFence(raw: string) {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

export function extractJsonObject(raw: string) {
  const cleaned = stripCodeFence(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
