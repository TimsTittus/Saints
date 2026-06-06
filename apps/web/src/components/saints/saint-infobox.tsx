import Image from "next/image";
import type { SaintFrontmatter } from "@/lib/saints";
import Badge from "@/components/ui/badge";

interface SaintInfoboxProps {
  frontmatter: SaintFrontmatter;
}

function InfoRow({ label, value }: { label: string; value: string | string[] }) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  if (!display) return null;
  return (
    <div className="infobox-row">
      <dt className="infobox-label">{label}</dt>
      <dd className="infobox-value">{display}</dd>
    </div>
  );
}

export default function SaintInfobox({ frontmatter }: SaintInfoboxProps) {
  const { displayName, mainImageUrl, imageCaption, infobox } = frontmatter;

  return (
    <aside className="infobox w-full" aria-label={`${displayName} information`}>
      {/* Header with portrait */}
      <div className="infobox-header">
        <h2 className="serif text-base font-semibold text-slate-800 mb-3">{displayName}</h2>
        <div className="relative mx-auto w-40 h-48 rounded-xl overflow-hidden border-2 border-amber-300/40 shadow-md">
          <Image
            src={mainImageUrl}
            alt={`Portrait of ${displayName}`}
            fill
            sizes="160px"
            className="object-cover object-top"
            priority
            quality={85}
          />
        </div>
        {imageCaption && (
          <p className="mt-2 text-xs text-slate-500 italic leading-snug">{imageCaption}</p>
        )}
      </div>

      {/* Details */}
      <dl>
        <InfoRow label="Venerated in" value={infobox.veneratedIn} />
        <InfoRow label="Feast day" value={infobox.feastDay} />
        <InfoRow label="Born" value={`${infobox.bornDate}${infobox.bornPlace ? `, ${infobox.bornPlace}` : ""}`} />
        <InfoRow label="Died" value={`${infobox.diedDate}${infobox.diedPlace ? `, ${infobox.diedPlace}` : ""}`} />
        <InfoRow label="Canonized" value={infobox.canonized} />
        {infobox.shrine && <InfoRow label="Shrine" value={infobox.shrine} />}
      </dl>

      {/* Attributes */}
      {infobox.attributes?.length > 0 && (
        <div className="infobox-row flex-col gap-1.5">
          <dt className="infobox-label">Attributes</dt>
          <dd className="flex flex-wrap gap-1 mt-1">
            {infobox.attributes.map((attr) => (
              <span
                key={attr}
                className="rounded-full bg-amber-100/70 px-2 py-0.5 text-xs text-amber-800 border border-amber-200/60"
              >
                {attr}
              </span>
            ))}
          </dd>
        </div>
      )}

      {/* Patronage */}
      {infobox.patronage?.length > 0 && (
        <div className="infobox-row flex-col gap-1.5 border-b-0">
          <dt className="infobox-label">Patron of</dt>
          <dd className="flex flex-wrap gap-1 mt-1">
            {infobox.patronage.map((p) => (
              <Badge key={p} label={p} className="text-xs" />
            ))}
          </dd>
        </div>
      )}
    </aside>
  );
}