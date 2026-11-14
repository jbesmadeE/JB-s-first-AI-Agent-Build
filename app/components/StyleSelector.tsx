"use client";

import { STYLES } from "@/lib/config";
import type { StyleId } from "@/lib/config";

interface StyleSelectorProps {
  style: StyleId;
  setStyle: (id: StyleId) => void;
  isGenerating: boolean;
}

export function StyleSelector({ style, setStyle, isGenerating }: StyleSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-3">
        Visual Style
      </label>
      <div className="grid grid-cols-2 gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={isGenerating}
            onClick={() => setStyle(s.id)}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${style === s.id ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-[0_0_12px_rgba(79,70,229,0.25)]" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
