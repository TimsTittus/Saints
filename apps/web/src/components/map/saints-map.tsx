"use client";

import { useEffect, useRef, useState } from "react";
import type { SaintCatalogEntry } from "@/lib/saints";
import { X, BookOpen, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@Saints/ui/lib/utils";

interface SaintsMapProps {
  saints: SaintCatalogEntry[];
}

export default function SaintsMap({ saints }: SaintsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedSaint, setSelectedSaint] = useState<SaintCatalogEntry | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Dynamically import Leaflet on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet.default);
        setMapLoaded(true);
      });
    }
  }, []);

  // Invalidate map size when toggling fullscreen
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [isFullscreen]);

  // Lock body scroll when modal or fullscreen map is open
  useEffect(() => {
    if (selectedSaint || isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedSaint, isFullscreen]);

  // Handle window resizing to invalidate Leaflet map size
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mapLoaded]);

  // 2. Initialize Map instance
  useEffect(() => {
    if (!mapLoaded || !L || !mapContainerRef.current || mapRef.current) return;

    // Center on Europe / Middle East as default
    const map = L.map(mapContainerRef.current, {
      center: [42, 12],
      zoom: 4,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Beautiful premium light theme tiles (CartoDB Positron)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded, L]);

  // 3. Update markers and fit bounds when saints list changes
  useEffect(() => {
    if (!mapRef.current || !L) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filter out saints without coordinates
    const saintsWithCoords = saints.filter((s) => s.coordinates);
    if (saintsWithCoords.length === 0) return;

    const bounds = L.latLngBounds([]);

    saintsWithCoords.forEach((saint) => {
      const coords = saint.coordinates!;
      const latLng = L.latLng(coords.lat, coords.lng);
      bounds.extend(latLng);

      // Create a gorgeous custom avatar marker
      const customIcon = L.divIcon({
        html: `
          <div class="relative w-12 h-12 flex items-center justify-center group cursor-pointer">
            <!-- Ripple halo -->
            <div class="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-75 group-hover:opacity-100 duration-1000"></div>
            <!-- Main circular thumbnail -->
            <div class="relative w-10 h-10 rounded-full border-2 border-amber-500 bg-white overflow-hidden shadow-md transition-all duration-300 transform group-hover:scale-110 group-hover:border-amber-600">
              <img src="${saint.thumbUrl}" alt="${saint.name}" class="w-full h-full object-cover" />
            </div>
            <!-- Cross badge -->
            <div class="absolute -bottom-0.5 right-0.5 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold border border-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              ✝
            </div>
          </div>
        `,
        className: "custom-saint-marker-icon",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24],
      });

      const marker = L.marker(latLng, { icon: customIcon })
        .addTo(map)
        .on("click", () => {
          setSelectedSaint(saint);
        });

      markersRef.current.push(marker);
    });

    // Fit map bounds to show all markers with padding
    if (saintsWithCoords.length > 0) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      map.fitBounds(bounds, {
        padding: isMobile ? [20, 20] : [50, 50],
        maxZoom: 7, // Avoid zooming in too close if only one marker
      });
    }
  }, [saints, L]);

  return (
    <>
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden glass",
          isFullscreen
            ? "fixed inset-0 z-[9998] w-screen h-screen rounded-none mt-0 border-none"
            : "relative w-full h-[450px] sm:h-[600px] rounded-2xl border border-white/60 shadow-lg mt-6"
        )}
      >
        {/* Background soft lighting */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/10 via-transparent to-amber-50/10 pointer-events-none z-10"></div>

        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-20">
            {/* Spinner */}
            <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
            <p className="serif text-lg font-medium text-slate-600">Loading Sacred Map...</p>
          </div>
        )}

        {/* Fullscreen/Restore toggle button */}
        {mapLoaded && (
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute top-4 right-4 z-[400] flex items-center justify-center p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200/50 dark:border-slate-800/50"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        )}

        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Immersive Full-Screen / Large Modal */}
      {selectedSaint && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in">
          <div className="relative w-full h-full sm:h-auto sm:max-w-2xl md:max-w-3xl rounded-none sm:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border-none sm:border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-scale-up">

            {/* Header/Close bar */}
            <div className="absolute top-4 right-4 z-50">
              <button
                type="button"
                onClick={() => setSelectedSaint(null)}
                className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal content */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              {/* Left / Top: Portrait */}
              <div className="relative shrink-0 w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 rounded-2xl border-4 border-amber-500/80 dark:border-amber-500/60 shadow-lg overflow-hidden bg-slate-50 dark:bg-slate-800 mt-4 md:mt-0">
                <img
                  src={selectedSaint.thumbUrl}
                  alt={selectedSaint.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right / Bottom: Text details */}
              <div className="flex-grow flex flex-col text-center md:text-left h-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5 inline-block">
                  {selectedSaint.category}
                </span>
                <h3 className="serif text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-3">
                  {selectedSaint.name}
                </h3>

                {/* Patronage and region info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    📍 {selectedSaint.region}
                  </span>
                  {selectedSaint.feastDay && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
                      📅 Feast: {selectedSaint.feastDay}
                    </span>
                  )}
                  {selectedSaint.deathYear && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      † {selectedSaint.deathYear}
                    </span>
                  )}
                </div>

                {/* Excerpt */}
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-sm sm:text-base flex-grow">
                  {selectedSaint.excerpt}
                </p>

                {/* Patronage list if any */}
                {selectedSaint.patronage && selectedSaint.patronage.length > 0 && (
                  <div className="mb-6 text-left">
                    <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 block mb-1">
                      Patronage
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedSaint.patronage.join(", ")}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto w-full">
                  <a
                    href={`/saints/${selectedSaint.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-all duration-150 shadow-md hover:shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 text-center no-underline"
                  >
                    <BookOpen size={16} />
                    Read Full Biography
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedSaint(null)}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors text-center"
                  >
                    Back to Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}