"use client";

import { AspectSelector } from "@/app/components/AspectSelector";
import { IdeaForm } from "@/app/components/IdeaForm";
import { Pipeline } from "@/app/components/Pipeline";
import { ProModal } from "@/app/components/ProModal";
import { ResultCard } from "@/app/components/ResultCard";
import { StyleSelector } from "@/app/components/StyleSelector";
import { useGeneration } from "@/app/hooks/useGeneration";
import { ASPECTS } from "@/lib/config";

export default function Home() {
  const {
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
  } = useGeneration();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              P
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                JB's First AI Agent Build
              </div>
              <div className="text-xs text-slate-500">AI Agent Build</div>
            </div>
          </div>
          <div className="text-sm text-slate-500 flex gap-4 items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981aa]"></span>
              Agents online
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <IdeaForm
              idea={idea}
              setIdea={setIdea}
              generate={generate}
              isGenerating={isGenerating}
              error={error}
            />
            <StyleSelector style={style} setStyle={setStyle} isGenerating={isGenerating} />
            <AspectSelector aspectRatio={aspectRatio} selectAspect={selectAspect} isGenerating={isGenerating} />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Pipeline progress={progress} />
            {result && (
              <ResultCard result={result} handleDownload={handleDownload} isGenerating={isGenerating} />
            )}
          </div>
        </div>
      </main>

      <ProModal
        proModalOpen={proModalOpen}
        setProModalOpen={setProModalOpen}
        lockedAspect={lockedAspect}
        setLockedAspect={setLockedAspect}
        setAspectRatio={setAspectRatio}
      />
    </div>
  );
}
