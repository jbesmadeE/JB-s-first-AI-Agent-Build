import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

const provider = createOpenAICompatible({
  name: 'ai-provider',
  baseURL: process.env.AI_BASE_URL || 'https://groq.com',
  apiKey: process.env.AI_API_KEY || 'ollama',
});

export const FALLBACK_MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
] as const;

const EXCLUDED_MODEL_SUBSTRINGS = ['whisper', 'orpheus', 'guard'];

async function discoverModels(): Promise<string[]> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(`${process.env.AI_BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) return [];
    const body = (await response.json()) as {
      data?: Array<{ id?: string; active?: boolean }>;
    };
    return (body.data ?? [])
      .filter((m) => m.id && (m.active ?? true))
      .map((m) => m.id!)
      .filter(
        (id) =>
          !EXCLUDED_MODEL_SUBSTRINGS.some((sub) =>
            id.toLowerCase().includes(sub.toLowerCase()),
          ),
      );
  } catch {
    return [];
  }
}

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
  const tried = new Set<string>();

  const tryModel = async (
    modelId: string,
  ): Promise<GenerateWithFallbackResult | null> => {
    if (tried.has(modelId)) return null;
    tried.add(modelId);
    const modelInstance = provider(modelId) as unknown as GenerateTextModel;
    try {
      const result = await generateText({
        model: modelInstance,
        system,
        prompt,
        maxTokens: 250,
      });
      return { text: result.text, modelUsed: modelId };
    } catch (err) {
      lastError = err;
      console.warn(
        `[generateWithFallback] model "${modelId}" failed, trying next:`,
        err instanceof Error ? err.message : String(err),
      );
      return null;
    }
  };

  for (const modelId of FALLBACK_MODELS) {
    const result = await tryModel(modelId);
    if (result) return result;
  }

  const discovered = await discoverModels();
  for (const modelId of discovered) {
    if (FALLBACK_MODELS.includes(modelId as (typeof FALLBACK_MODELS)[number]))
      continue;
    const result = await tryModel(modelId);
    if (result) return result;
  }

  throw lastError ?? new Error('All fallback models failed');
}
