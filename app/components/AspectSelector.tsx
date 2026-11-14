"use client";

import { ASPECTS } from "@/lib/config";
import type { AspectId } from "@/lib/config";

interface AspectSelectorProps {
  aspectRatio: AspectId;
  selectAspect: (id: AspectId) => void;
  isGenerating: boolean;
}

export function AspectSelector({ aspectRatio, selectAspect, isGenerating }: AspectSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-3">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-3 gap-2">
        {ASPECTS.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={a.pro || isGenerating}
            onClick={() => selectAspect(a.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${aspectRatio === a.id ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm" : a.pro ? "bg-slate-900/50 border-slate-700 text-slate-500 cursor-default hover:bg-slate-900/50" : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50"}`}
            title={a.pro ? "Wide and Portrait are Pro features" : undefined}
          >
            <div className="w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center text-[10px]">
              {aspectRatio === a.id ? "✓" : a.pro ? "🔒" : ""}
            </div>
            <span className="leading-tight">{a.label}</span>
            <span className="text-[10px] opacity-50">{a.width}×{a.height}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
