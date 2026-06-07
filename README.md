# Sancti — The Catholic Saints Encyclopedia

A premium, modern web application mapping the lives, patronages, and shrines of Catholic saints, blesseds, and martyrs across every era and region of the world.

---

## Key Features

- **Interactive Sacred Map** — Leaflet-powered map displaying saint birthplaces/shrines with a custom React detail modal and fluid fullscreen viewport toggle.
- **Dynamic Layout Perspectives** — Easily switch between **Grid Card View**, **A–Z Alphabetical Catalog**, and **Geographic Map View**.
- **Contextual Search & Filters** — Sticky filter bar supporting text query search, letter indexing, category classification, regional mapping, and historical era filters.
- **Rich Hagiographies** — Immersive biographies built dynamically using static MDX templates and responsive metadata infoboxes.
- **Dual Themes** — Full dark and light mode styling with premium glassmorphism accents.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Monorepo Build System:** Turborepo & Bun Workspaces
- **Styling:** Vanilla CSS with custom OKLCH design tokens & TailwindCSS utilities
- **Map Library:** Leaflet (Client-side dynamic integration)
- **Shared UI Library:** shadcn/ui primitives (`packages/ui`)

---

## Directory Structure

```text
Saints/
├── apps/
│   └── web/           # Next.js web application
│       ├── public/    # Static assets (portraits & maps)
│       └── src/
│           ├── app/   # Router pages & detail hagiographies
│           ├── data/  # JSON metadata catalogs
│           └── lib/   # Filter and parsing utilities
└── packages/
    └── ui/            # Shared component library
```

---