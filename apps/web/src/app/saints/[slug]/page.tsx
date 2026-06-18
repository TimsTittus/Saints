import { notFound } from "next/navigation";
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSaintBySlug, getAllSlugs, getSaintsCatalog } from "@/lib/saints";
import SaintInfobox from "@/components/saints/saint-infobox";
import SaintCard from "@/components/saints/saint-card";
import Badge from "@/components/ui/badge";
import SaintLink from "@/components/saints/saint-link";
import MdxFigure from "@/components/mdx-figure";

// ── Static import map (required by Turbopack – no dynamic import() of MDX) ───
import FrancisContent, * as FrancisMeta from "@/content/saints/francis-of-assisi.mdx";
import TeresaContent, * as TeresaMeta from "@/content/saints/teresa-of-avila.mdx";
import ThomasContent, * as ThomasMeta from "@/content/saints/thomas-aquinas.mdx";
import JoanContent, * as JoanMeta from "@/content/saints/joan-of-arc.mdx";
import MaryContent, * as MaryMeta from "@/content/saints/mary-magdalene.mdx";
import PatrickContent, * as PatrickMeta from "@/content/saints/patrick-of-ireland.mdx";
import AugustineContent, * as AugustineMeta from "@/content/saints/augustine-of-hippo.mdx";
import ThereseContent, * as ThereseMeta from "@/content/saints/therese-of-lisieux.mdx";
import AnthonyContent, * as AnthonyMeta from "@/content/saints/anthony-of-padua.mdx";
import CatherineContent, * as CatherineMeta from "@/content/saints/catherine-of-siena.mdx";
import AlphonsaContent, * as AlphonsaMeta from "@/content/saints/alphonsa-muttathupadathu.mdx";
import ChavaraContent, * as ChavaraMeta from "@/content/saints/kuriakose-elias-chavara.mdx";
import EuphrasiaContent, * as EuphrasiaMeta from "@/content/saints/euphrasia-eluvathingal.mdx";
import MariamContent, * as MariamMeta from "@/content/saints/mariam-thresia-chiramel.mdx";

type MDXModule = {
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
  frontmatter?: Record<string, unknown>;
};

const CONTENT_MAP: Record<string, MDXModule> = {
  "francis-of-assisi": { ...FrancisMeta, default: FrancisContent },
  "teresa-of-avila": { ...TeresaMeta, default: TeresaContent },
  "thomas-aquinas": { ...ThomasMeta, default: ThomasContent },
  "joan-of-arc": { ...JoanMeta, default: JoanContent },
  "mary-magdalene": { ...MaryMeta, default: MaryContent },
  "patrick-of-ireland": { ...PatrickMeta, default: PatrickContent },
  "augustine-of-hippo": { ...AugustineMeta, default: AugustineContent },
  "therese-of-lisieux": { ...ThereseMeta, default: ThereseContent },
  "anthony-of-padua": { ...AnthonyMeta, default: AnthonyContent },
  "catherine-of-siena": { ...CatherineMeta, default: CatherineContent },
  "alphonsa-muttathupadathu": { ...AlphonsaMeta, default: AlphonsaContent },
  "kuriakose-elias-chavara": { ...ChavaraMeta, default: ChavaraContent },
  "euphrasia-eluvathingal": { ...EuphrasiaMeta, default: EuphrasiaContent },
  "mariam-thresia-chiramel": { ...MariamMeta, default: MariamContent },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxComponents: Record<string, React.ComponentType<any>> = {
  SaintLink,
  Figure: MdxFigure,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSaintBySlug(slug);
  if (!entry) return { title: "Saint Not Found" };

  return {
    title: entry.name,
    description: entry.excerpt,
    openGraph: {
      title: `${entry.name} · Sancti`,
      description: entry.excerpt,
      images: [{ url: entry.thumbUrl }],
    },
  };
}

export default async function SaintDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getSaintBySlug(slug);
  if (!entry) notFound();

  const mod = CONTENT_MAP[slug];
  if (!mod) notFound();

  const Content = mod.default;
  const frontmatter = (mod.frontmatter ?? {}) as {
    displayName?: string;
    mainImageUrl?: string;
    imageCaption?: string;
    infobox?: {
      veneratedIn: string;
      feastDay: string;
      bornDate: string;
      bornPlace: string;
      diedDate: string;
      diedPlace: string;
      canonized: string;
      attributes: string[];
      patronage: string[];
      shrine?: string;
    };
    seoDescription?: string;
  };

  // Related saints (same region, exclude current)
  const allSaints = getSaintsCatalog();
  const related = allSaints
    .filter((s) => s.id !== slug && s.region === entry.region)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-slate-500">
          <li>
            <Link href="/" className="hover:text-amber-700 transition-colors duration-150">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} className="opacity-50" />
          </li>
          <li>
            <Link href="/#saints" className="hover:text-amber-700 transition-colors duration-150">
              Saints
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} className="opacity-50" />
          </li>
          <li className="font-medium text-slate-700" aria-current="page">
            {entry.shortName}
          </li>
        </ol>
      </nav>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_288px]">
        {/* Left: prose */}
        <article className="order-2 lg:order-1" aria-label={`Biography of ${entry.name}`}>
          {/* Title row */}
          <div className="mb-6">
            <h1
              className="serif text-4xl sm:text-5xl font-semibold leading-tight text-slate-800"
              style={{ fontFamily: "var(--font-crimson, 'Crimson Pro', Georgia, serif)" }}
            >
              {frontmatter.displayName || entry.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge label={entry.category} variant={entry.category} />
              {entry.feastDay && (
                <span className="text-sm text-slate-500">
                  Feast Day: <span className="font-medium text-slate-700">{entry.feastDay}</span>
                </span>
              )}
              {entry.deathYear && (
                <span className="text-sm text-slate-500">
                  †{entry.deathYear}
                  {entry.birthYear ? ` (b. ${entry.birthYear})` : ""}
                </span>
              )}
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-amber-300/40 via-amber-200/20 to-transparent" />
          </div>

          {/* MDX content */}
          <div className="prose-saints">
            <Content components={mdxComponents} />
          </div>
        </article>

        {/* Right: infobox */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-[calc(var(--header-height)+1rem)] self-start">
          <SaintInfobox
            frontmatter={{
              id: entry.id,
              displayName: frontmatter.displayName || entry.name,
              mainImageUrl: frontmatter.mainImageUrl || entry.thumbUrl,
              imageCaption: frontmatter.imageCaption || "",
              infobox: frontmatter.infobox || {
                veneratedIn: "",
                feastDay: entry.feastDay,
                bornDate: entry.birthYear?.toString() ?? "",
                bornPlace: entry.country,
                diedDate: entry.deathYear?.toString() ?? "",
                diedPlace: entry.country,
                canonized: "",
                attributes: [],
                patronage: entry.patronage,
              },
              seoDescription: frontmatter.seoDescription || entry.excerpt,
            }}
          />
        </aside>
      </div>

      {/* Related saints */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <div className="mb-6 flex items-center gap-4">
            <h2
              id="related-heading"
              className="serif text-2xl font-semibold text-slate-800"
              style={{ fontFamily: "var(--font-crimson, 'Crimson Pro', Georgia, serif)" }}
            >
              More from {entry.region}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-300/40 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {related.map((s) => (
              <SaintCard key={s.id} saint={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
