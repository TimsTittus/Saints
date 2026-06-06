"use client";
import { cn } from "@Saints/ui/lib/utils";
import { ALPHABET } from "@/lib/constants";

interface AlphaFilterProps {
  activeLetter: string | null;
  availableLetters: Set<string>;
  onChange: (letter: string | null) => void;
}

export default function AlphaFilter({
  activeLetter,
  availableLetters,
  onChange,
}: AlphaFilterProps) {
  return (
    <div
      className="flex gap-0.5 overflow-x-auto pb-1 scrollbar-none"
      role="group"
      aria-label="Filter by letter"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "flex-shrink-0 h-7 min-w-[2rem] rounded-md px-2 text-xs font-semibold transition-all duration-150",
          activeLetter === null
            ? "bg-amber-500 text-white shadow-sm shadow-amber-400/40"
            : "text-slate-500 hover:bg-amber-100/60 hover:text-amber-700"
        )}
        aria-pressed={activeLetter === null}
      >
        All
      </button>

      {ALPHABET.map((letter) => {
        const available = availableLetters.has(letter);
        const active = activeLetter === letter;
        return (
          <button
            key={letter}
            type="button"
            disabled={!available}
            onClick={() => onChange(active ? null : letter)}
            className={cn(
              "flex-shrink-0 h-7 w-7 rounded-md text-xs font-semibold transition-all duration-150",
              active
                ? "bg-amber-500 text-white shadow-sm shadow-amber-400/40"
                : available
                  ? "text-slate-600 hover:bg-amber-100/60 hover:text-amber-700"
                  : "text-slate-300 cursor-not-allowed"
            )}
            aria-pressed={active}
            aria-label={`Filter by ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}