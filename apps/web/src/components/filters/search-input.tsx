"use client";
import { useId, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@Saints/ui/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search saints, patronage, country…",
  autoFocus = false,
  className,
}: SearchInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [autoFocus]);

  return (
    <div className={cn("relative group", className)}>
      <label htmlFor={id} className="sr-only">
        Search saints
      </label>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors duration-200 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-xl border border-white/70 bg-white/60 pl-9 pr-10 text-sm text-slate-700 placeholder:text-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/60 transition-all duration-200"
        autoComplete="off"
        spellCheck="false"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 transition-colors duration-150"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
      {!value && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 rounded border border-slate-200/80 bg-white/50 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono pointer-events-none">
          ⌘K
        </kbd>
      )}
    </div>
  );
}