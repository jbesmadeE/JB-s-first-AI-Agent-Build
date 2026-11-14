import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const provider = createOpenAICompatible({
  name: 'ai-provider',
  baseURL: process.env.AI_BASE_URL || 'https://groq.com',
  apiKey: process.env.AI_API_KEY || 'ollama',
});

export const model = provider(process.env.AI_MODEL || 'llama-3.3-70b-versatile');
