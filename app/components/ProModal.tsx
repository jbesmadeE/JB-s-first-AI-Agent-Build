"use client";

import type { AspectId } from "@/lib/config";

interface ProModalProps {
  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
  lockedAspect: AspectId | null;
  setLockedAspect: (id: AspectId | null) => void;
  setAspectRatio: (id: AspectId) => void;
}

export function ProModal({ proModalOpen, setProModalOpen, lockedAspect, setLockedAspect, setAspectRatio }: ProModalProps) {
  if (!proModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setProModalOpen(false)} />
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl w-full max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl mb-4 shadow-lg shadow-pink-500/25">
          ✦
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Upgrade to Pro</h2>
        <p className="text-slate-400 mb-6">
          Wide and Portrait aspect ratios are Pro features. Square is free for everyone.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setProModalOpen(false);
              if (lockedAspect) setAspectRatio(lockedAspect);
              setLockedAspect(null);
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-pink-600 to-rose-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-pink-500 hover:to-rose-500 transition"
          >
            Go Pro
          </button>
          <button
            onClick={() => setProModalOpen(false)}
            className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            Stick with Square
          </button>
        </div>
      </div>
    </div>
  );
}
