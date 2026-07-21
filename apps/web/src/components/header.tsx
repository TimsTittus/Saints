"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoogleTranslate } from "./google-translate";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@Saints/ui/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#saints", label: "Saints" },
] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 glass border-b border-white/60"
      style={{ height: "var(--header-height)" }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg px-1"
          aria-label="Sancti — home"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-300 group-hover:scale-110"
          >
            <rect x="9" y="1" width="4" height="20" rx="2" fill="url(#logo-grad)" />
            <rect x="1" y="8" width="20" height="4" rx="2" fill="url(#logo-grad)" />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d4a84b" />
                <stop offset="100%" stopColor="#f0c060" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="serif text-xl font-semibold tracking-wide text-slate-800 group-hover:text-amber-700 transition-colors duration-200"
            style={{ fontFamily: "var(--font-crimson, 'Crimson Pro', Georgia, serif)" }}
          >
            Sancti
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-amber-100/80 text-amber-800"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
                )}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <GoogleTranslate />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}