"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ASPECTS, STYLES } from "@/lib/config";
import type { AspectId, StyleId } from "@/lib/config";

type Result = { enhancedPrompt: string; imageUrl: string };

export function useGeneration() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState<StyleId>("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState<AspectId>("Square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [lockedAspect, setLockedAspect] = useState<AspectId | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!idea.trim()) return;
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setError(null);
      setResult(null);
      setIsGenerating(true);
      setProgress(0);

      let cancelled = false;
      const timers: ReturnType<typeof setTimeout>[] = [
        setTimeout(() => { if (!cancelled) setProgress(1); }, 120),
        setTimeout(() => { if (!cancelled) setProgress(2); }, 800),
        setTimeout(() => { if (!cancelled) setProgress(3); }, 1500),
      ];

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, style, aspectRatio }),
          signal: abortRef.current.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error((data as { error?: string }).error || "Generation failed");

        cancelled = true;
        timers.forEach((t) => clearTimeout(t));
        setProgress(3);
        setResult(data as Result);
      } catch (err) {
        cancelled = true;
        timers.forEach((t) => clearTimeout(t));
        setProgress(0);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsGenerating(false);
      }
    },
    [idea, style, aspectRatio]
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Unable to fetch image");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "pixelforge-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const selectAspect = (id: AspectId) => {
    const aspect = ASPECTS.find((a) => a.id === id);
    if (!aspect) return;
    if (aspect.pro) {
      setLockedAspect(id);
      setProModalOpen(true);
      return;
    }
    setAspectRatio(id);
  };

  return {
    idea,
    setIdea,
    style,
    setStyle,
    aspectRatio,
    setAspectRatio,
    isGenerating,
    progress,
    result,
    error,
    proModalOpen,
    setProModalOpen,
    lockedAspect,
    setLockedAspect,
    generate,
    handleDownload,
    selectAspect,
  };
}
