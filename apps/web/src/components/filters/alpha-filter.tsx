"use client";
import { useState, useEffect } from "react";
import { cn } from "@Saints/ui/lib/utils";
import { ALPHABET } from "@/lib/constants";

interface AlphaFilterProps {
  activeLetter: string | null;
  availableLetters: string[];
  onChange: (letter: string | null) => void;
}

export default function AlphaFilter({
  activeLetter,
  availableLetters,
  onChange,
}: AlphaFilterProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-0.5 overflow-x-auto sm:overflow-x-auto pb-1 scrollbar-none"
      role="group"
      aria-label="Filter by letter"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "flex-shrink-0 h-8 sm:h-7 min-w-[2.5rem] sm:min-w-[2rem] rounded-md px-2.5 sm:px-2 text-xs font-semibold transition-all duration-150 cursor-pointer",
          activeLetter === null
            ? "bg-amber-500 text-white shadow-sm shadow-amber-400/40"
            : "text-slate-500 hover:bg-amber-100/60 hover:text-amber-700"
        )}
        aria-pressed={activeLetter === null}
      >
        All
      </button>

      {ALPHABET.map((letter) => {
        const available = mounted ? availableLetters.includes(letter) : true;
        const active = activeLetter === letter;
        return (
          <button
            key={letter}
            type="button"
            disabled={!available}
            onClick={() => onChange(active ? null : letter)}
            className={cn(
              "flex-shrink-0 h-8 w-8 sm:h-7 sm:w-7 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer",
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