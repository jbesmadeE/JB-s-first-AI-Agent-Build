import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

const provider = createOpenAICompatible({
  name: 'ai-provider',
  baseURL: process.env.AI_BASE_URL || 'https://groq.com',
  apiKey: process.env.AI_API_KEY || 'ollama',
});

export const FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
] as const;

export const model = provider(process.env.AI_MODEL || FALLBACK_MODELS[0]);

type GenerateTextModel = Parameters<typeof generateText>[0]['model'];

export interface GenerateWithFallbackResult {
  text: string;
  modelUsed: string;
}

export async function generateWithFallback({
  system,
  prompt,
}: {
  system: string;
  prompt: string;
}): Promise<GenerateWithFallbackResult> {
  let lastError: unknown;
  for (const modelId of FALLBACK_MODELS) {
    const modelInstance = provider(modelId) as unknown as GenerateTextModel;
    try {
      const result = await generateText({
        model: modelInstance,
        system,
        prompt,
        maxOutputTokens: 250,
      });
      return { text: result.text, modelUsed: modelId };
    } catch (err) {
      lastError = err;
      console.warn(
        `[generateWithFallback] model "${modelId}" failed, trying next:`,
        err instanceof Error ? err.message : String(err),
      );
    }
  }
  throw lastError ?? new Error('All fallback models failed');
}
