"use client";

import { useState } from "react";
import { Lightbulb, Sparkles, RotateCw } from "lucide-react";

type SuggestionsProps = {
  onAdd: (title: string) => Promise<void>;
};

export default function Suggestions({ onAdd }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  async function fetchSuggestions(t?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (t?.trim()) params.set("topic", t.trim());
      const res = await fetch(`/api/suggestions?${params}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(title: string) {
    setAdding(title);
    try {
      await onAdd(title);
      setSuggestions((prev) => prev.filter((s) => s !== title));
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Lightbulb size={16} className="text-amber-500" />
          AI Suggestions
        </div>
        {suggestions.length > 0 && (
          <button
            onClick={() => fetchSuggestions(topic)}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-all"
          >
            <RotateCw size={14} />
            Refresh
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g., work, health, learning)"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            onClick={() => fetchSuggestions(topic)}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles size={14} />
            {loading ? "Thinking..." : "Suggest"}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-zinc-400">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-amber-500 mr-2" />
            Generating suggestions...
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="grid gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAdd(suggestion)}
                disabled={adding === suggestion}
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg bg-zinc-50 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700 border border-zinc-100 hover:border-blue-200 transition-all disabled:opacity-50 dark:bg-zinc-700/50 dark:text-zinc-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 dark:border-zinc-600 dark:hover:border-blue-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="flex-1">{suggestion}</span>
                {adding === suggestion && (
                  <span className="text-xs text-zinc-400">Adding...</span>
                )}
              </button>
            ))}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <p className="text-center text-xs text-zinc-400 py-2">
            Enter a topic and click Suggest to get AI-powered todo ideas.
          </p>
        )}
      </div>
    </div>
  );
}
