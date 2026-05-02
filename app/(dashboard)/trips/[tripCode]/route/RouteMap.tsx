"use client";

import { useEffect, useRef, useState } from "react";

import type { RoutePointDto, RoutePreviewDto } from "@/lib/routePointTypes";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = "© OpenStreetMap";

const EUROPE_CENTER: [number, number] = [52.2, 10.5];
const DEFAULT_ZOOM = 4;

type LeafletModule = typeof import("leaflet");

export default function RouteMap({
  points,
  routePreview,
  className,
}: {
  points: RoutePointDto[];
  routePreview: RoutePreviewDto | null;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<InstanceType<LeafletModule["Map"]> | null>(null);
  const markersLayerRef = useRef<InstanceType<LeafletModule["LayerGroup"]> | null>(null);
  const routeLayerRef = useRef<InstanceType<LeafletModule["LayerGroup"]> | null>(null);
  const LRef = useRef<LeafletModule | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;

    void (async () => {
      await import("leaflet/dist/leaflet.css");
      const leafletMod = await import("leaflet");
      const L = leafletMod.default;
      if (disposed || !containerRef.current) return;

      LRef.current = L;
      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        attributionControl: false,
      }).setView(
        EUROPE_CENTER,
        DEFAULT_ZOOM
      );
      mapRef.current = map;

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
    })();

    return () => {
      disposed = true;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
      LRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;
    if (!mapReady || !L || !map || !markersLayer || !routeLayer) return;

    markersLayer.clearLayers();
    routeLayer.clearLayers();

    const withCoords = points.filter(
      (p) => p.lat != null && p.lng != null && Number.isFinite(p.lat) && Number.isFinite(p.lng)
    );

    withCoords.forEach((p, index) => {
      const latlng: [number, number] = [p.lat as number, p.lng as number];
      const label = `${index + 1}. ${p.city}, ${p.country}`;
      const marker = L.circleMarker(latlng, {
        radius: 9,
        color: "#0a2351",
        weight: 2,
        fillColor: "#3E67BF",
        fillOpacity: 1,
      });
      marker.bindTooltip(label, { direction: "top", offset: [0, -8] });
      marker.addTo(markersLayer);
    });

    const boundsParts: [number, number][][] = [];

    if (routePreview?.geometry?.length) {
      const routeLine = L.polyline(routePreview.geometry, {
        color: "#0a2351",
        weight: 4,
        opacity: 0.85,
      });
      routeLine.addTo(routeLayer);
      boundsParts.push(routePreview.geometry);
    }

    if (withCoords.length > 0) {
      boundsParts.push(withCoords.map((p) => [p.lat as number, p.lng as number]));
    }

    if (boundsParts.length > 0) {
      const bounds = L.latLngBounds(boundsParts.flat());
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
    } else {
      map.setView(EUROPE_CENTER, DEFAULT_ZOOM);
    }
  }, [points, routePreview, mapReady]);

  const missing = points.length > 0 && points.every((p) => p.lat == null || p.lng == null);

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-[40px] border border-[#5b616e]/10 bg-[#eef0f3] shadow-sm",
        className ?? "h-[400px]",
      ].join(" ")}
    >
      <div ref={containerRef} className="absolute inset-0 z-0" aria-label="Mapa trasy" />
      {!mapReady && (
        <div className="absolute inset-0 z-300 flex items-center justify-center bg-[#f8f9fa]/90 text-sm font-medium text-[#5b616e]">
          Ladowanie mapy...
        </div>
      )}
      {missing && mapReady && (
        <div className="absolute inset-0 z-400 flex items-center justify-center bg-white/85 px-4 text-center text-sm font-medium text-[#5b616e]">
          Punkty nie maja jeszcze wspolrzednych. Dodaj lub edytuj punkt.
        </div>
      )}
      <div className="pointer-events-none absolute bottom-1 left-1 right-1 z-500 rounded-lg bg-white/90 px-2 py-1 text-[10px] leading-tight text-[#5b616e] shadow-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {TILE_ATTRIBUTION}
      </div>
    </div>
  );
}
