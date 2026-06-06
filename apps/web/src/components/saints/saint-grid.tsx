import type { SaintCatalogEntry } from "@/lib/saints";
import { groupByLetter } from "@/lib/filters";
import SaintCard from "./saint-card";
import { ALPHABET } from "@/lib/constants";

interface SaintGridProps {
  saints: SaintCatalogEntry[];
  viewMode: "grid" | "alpha";
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="mb-4 opacity-30"
        aria-hidden="true"
      >
        <rect x="21" y="4" width="6" height="40" rx="3" fill="currentColor" className="text-amber-600" />
        <rect x="4" y="18" width="40" height="6" rx="3" fill="currentColor" className="text-amber-600" />
      </svg>
      <p className="serif text-xl font-medium text-slate-500">No saints found</p>
      <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search query.</p>
    </div>
  );
}

function GridView({ saints }: { saints: SaintCatalogEntry[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {saints.map((saint) => (
        <SaintCard key={saint.id} saint={saint} />
      ))}
    </div>
  );
}

function AlphaView({ saints }: { saints: SaintCatalogEntry[] }) {
  const grouped = groupByLetter(saints);
  const activeLetters = Object.keys(grouped).sort();

  if (activeLetters.length === 0) return <EmptyState />;

  return (
    <div className="space-y-12">
      {ALPHABET.filter((l) => grouped[l]).map((letter) => (
        <section key={letter} id={`letter-${letter}`}>
          <div className="mb-6 flex items-center gap-4">
            <span className="alpha-section-letter">{letter}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-300/40 to-transparent" />
            <span className="text-xs text-slate-400 font-medium">
              {grouped[letter].length} {grouped[letter].length === 1 ? "saint" : "saints"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {grouped[letter].map((saint) => (
              <SaintCard key={saint.id} saint={saint} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function SaintGrid({ saints, viewMode }: SaintGridProps) {
  if (saints.length === 0) return <EmptyState />;

  if (viewMode === "alpha") return <AlphaView saints={saints} />;
  return <GridView saints={saints} />;
}