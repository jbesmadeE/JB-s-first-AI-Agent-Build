import { generateWithFallback } from "@/agents/lib/ai";
import { ENHANCER_AGENT_MD, DIRECTOR_AGENT_MD } from "@/agents/prompts";
import { buildImageUrl } from "@/agents/lib/imageGen";
import { DIMENSIONS } from "@/lib/config";

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

    const enhancer = await generateWithFallback({
      system: ENHANCER_AGENT_MD,
      prompt: idea,
    });
    const expandedPrompt = enhancer.text.trim();

    const director = await generateWithFallback({
      system: DIRECTOR_AGENT_MD,
      prompt: `${expandedPrompt}\nStyle: ${style}`,
    });
    const enhancedPrompt = director.text
      .replace(/[\r\n]+/g, " ")
      .replace(/[*#:"'“”‘’`]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const imageUrl = buildImageUrl(enhancedPrompt, width, height);

    return Response.json({
      enhancedPrompt,
      imageUrl,
      enhancerModelUsed: enhancer.modelUsed,
      directorModelUsed: director.modelUsed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("Generate API error:", err);
    return Response.json({ error: message || "Generation failed" }, { status: 500 });
  }
}
