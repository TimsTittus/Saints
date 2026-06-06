"use client";

import { useEffect, useRef, useState } from "react";
import type { SaintCatalogEntry } from "@/lib/saints";

interface SaintsMapProps {
  saints: SaintCatalogEntry[];
}

export default function SaintsMap({ saints }: SaintsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 1. Dynamically import Leaflet on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet.default);
        setMapLoaded(true);
      });
    }
  }, []);

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

      // Beautiful Wikipedia-styled popup content
      const popupContent = `
        <div class="p-3 max-w-[220px] text-center font-sans">
          <div class="w-16 h-20 mx-auto rounded-full border-2 border-amber-500 overflow-hidden mb-2 shadow-sm">
            <img src="${saint.thumbUrl}" alt="${saint.name}" class="w-full h-full object-cover" />
          </div>
          <h4 class="font-semibold text-slate-800 text-sm mb-1" style="font-family: var(--font-serif)">${saint.name}</h4>
          <div class="text-[10px] font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 inline-block mb-2">${saint.category}</div>
          <p class="text-[11px] leading-relaxed text-slate-500 mb-3">${saint.excerpt}</p>
          <a href="/saints/${saint.id}" class="inline-block w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm text-center no-underline">
            View Biography
          </a>
        </div>
      `;

      const marker = L.marker(latLng, { icon: customIcon })
        .bindPopup(popupContent, {
          closeButton: false,
          className: "custom-saint-popup",
        })
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Fit map bounds to show all markers with padding
    if (saintsWithCoords.length > 0) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 7, // Avoid zooming in too close if only one marker
      });
    }
  }, [saints, L]);

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden glass border border-white/60 shadow-lg mt-6">
      {/* Background soft lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/10 via-transparent to-amber-50/10 pointer-events-none z-10"></div>

      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-20">
          {/* Spinner */}
          <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
          <p className="serif text-lg font-medium text-slate-600">Loading Sacred Map...</p>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}