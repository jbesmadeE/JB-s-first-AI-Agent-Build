import { generateText } from "ai";
import { model } from "@/agents/lib/ai";
import { ENHANCER_AGENT_MD, DIRECTOR_AGENT_MD } from "@/agents/prompts";
import { buildImageUrl } from "@/agents/lib/imageGen";
import { DIMENSIONS } from "@/lib/config";

const lm = model as unknown as Parameters<typeof generateText>[0]["model"];

export const runtime = "nodejs";

interface GenerateBody {
  idea: string;
  style: string;
  aspectRatio: string;
}

function parseBody(body: unknown): GenerateBody | null {
  if (!body || typeof body !== "object") return null;
  const obj = body as Record<string, unknown>;
  if (typeof obj.idea !== "string" || typeof obj.style !== "string" || typeof obj.aspectRatio !== "string") {
    return null;
  }
  return obj as unknown as GenerateBody;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as unknown;
    const parsed = parseBody(body);
    if (!parsed) {
      return Response.json({ error: "idea, style, and aspectRatio are required" }, { status: 400 });
    }

    const { idea, style, aspectRatio } = parsed;
    const { width, height } = DIMENSIONS[aspectRatio] ?? DIMENSIONS.Square;

    const enhancer = await generateText({
      model: lm,
      system: ENHANCER_AGENT_MD,
      prompt: idea,
      maxOutputTokens: 250,
    });
    const expandedPrompt = enhancer.text.trim();

    const director = await generateText({
      model: lm,
      system: DIRECTOR_AGENT_MD,
      prompt: `${expandedPrompt}\nStyle: ${style}`,
      maxOutputTokens: 250,
    });
    const finalPrompt = director.text.trim();

    const imageUrl = buildImageUrl(finalPrompt, width, height);

    return Response.json({ enhancedPrompt: finalPrompt, imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("Generate API error:", err);
    return Response.json({ error: message || "Generation failed" }, { status: 500 });
  }
}
