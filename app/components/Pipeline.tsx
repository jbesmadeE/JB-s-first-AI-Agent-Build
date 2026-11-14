"use client";

import { STEPS } from "@/lib/config";

interface PipelineProps {
  progress: number;
}

export function Pipeline({ progress }: PipelineProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 shadow-xl">
      <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase mb-4">
        Pipeline
      </h2>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${progress === 3 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800/50 text-slate-500 border border-slate-700"}`}>
          {progress === 3 ? "Complete" : progress === 0 ? "Idle" : "Working"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {STEPS.map((step) => (
          <div key={step.id} className="flex-1 relative">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${progress >= step.id ? "bg-emerald-500 text-slate-950" : progress === step.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-500 border border-slate-700"}`}>
                {progress >= step.id ? "✓" : step.id}
              </div>
              <span className={`text-[10px] font-medium leading-tight text-center ${progress >= step.id ? "text-slate-200" : "text-slate-500"}`}>
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      {progress > 0 && progress < 3 && (
        <p className="mt-4 text-xs text-slate-400 text-center">
          {progress === 1 ? "Expanding your idea…" : progress === 2 ? "Applying style…" : "Rendering pixels…"}
        </p>
      )}
    </section>
  );
}
