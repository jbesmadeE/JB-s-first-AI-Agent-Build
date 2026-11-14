"use client";

interface ResultCardProps {
  result: { enhancedPrompt: string; imageUrl: string };
  handleDownload: (url: string) => Promise<void>;
  isGenerating: boolean;
}

export function ResultCard({ result, handleDownload, isGenerating }: ResultCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          Result
        </h2>
        <button
          onClick={() => handleDownload(result.imageUrl)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-50 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>
      </div>

      <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-950 aspect-video flex items-center justify-center relative group">
        <img src={result.imageUrl} alt="Generated image" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="text-white/70 text-sm font-medium">AI-generated image</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Enhanced Prompt
        </label>
        <div className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-3 text-sm text-slate-300 italic">
          "{result.enhancedPrompt}"
        </div>
      </div>
    </section>
  );
}
