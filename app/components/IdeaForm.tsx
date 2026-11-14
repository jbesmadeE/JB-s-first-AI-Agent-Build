"use client";

interface IdeaFormProps {
  idea: string;
  setIdea: (value: string) => void;
  generate: (e: React.FormEvent) => void;
  isGenerating: boolean;
  error: string | null;
}

export function IdeaForm({ idea, setIdea, generate, isGenerating, error }: IdeaFormProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 shadow-xl">
      <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase mb-5">
        Your Idea
      </h2>
      <form onSubmit={generate} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            What would you like to create?
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. A lone astronaut floating among neon nebulae"
          />
        </div>

        <button
          type="submit"
          disabled={!idea.trim() || isGenerating}
          className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-pink-600 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-pink-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          {isGenerating ? "Generating…" : "Generate Image"}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-900/20 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}
    </section>
  );
}
