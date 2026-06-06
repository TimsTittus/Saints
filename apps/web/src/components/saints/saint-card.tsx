import Link from "next/link";
import Image from "next/image";
import type { SaintCatalogEntry } from "@/lib/saints";
import Badge from "@/components/ui/badge";

interface SaintCardProps {
  saint: SaintCatalogEntry;
}

export default function SaintCard({ saint }: SaintCardProps) {
  return (
    <Link
      href={`/saints/${saint.id}`}
      className="group flex flex-col items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl p-1"
      aria-label={`View ${saint.name}`}
    >
      {/* Oval portrait */}
      <div className="saint-oval w-full max-w-[160px] relative">
        <Image
          src={saint.thumbUrl}
          alt={`Portrait of ${saint.name}`}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 160px"
          className="object-cover object-top"
          loading="lazy"
          quality={75}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-[50%] bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white text-xs font-medium px-2 text-center leading-tight">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="text-center w-full px-1">
        <h3 className="serif text-base font-semibold text-slate-800 leading-tight group-hover:text-amber-700 transition-colors duration-200 line-clamp-2">
          {saint.shortName}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
          <Badge label={saint.category} variant={saint.category} />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {saint.feastDay}
          {saint.deathYear ? ` · †${saint.deathYear}` : ""}
        </p>
        {/* Excerpt on hover (hidden on mobile) */}
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          {saint.excerpt}
        </p>
      </div>
    </Link>
  );
}