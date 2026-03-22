import OpenAI from 'openai';

export function getModelConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'http://ai-api.applesay.cn/v1',
    model: process.env.OPENAI_MODEL || 'qwen3.5-plus',
  };
}

export function hasModelConfig() {
  return Boolean(getModelConfig().apiKey);
}

export function createOpenAIClient() {
  const { apiKey, baseURL } = getModelConfig();
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL });
}

