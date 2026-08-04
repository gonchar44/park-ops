"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { DEFAULT_MAP_VIEW, GEOAPIFY_API_KEY, getMapStyleUrl } from "@/features/map/lib/config";
import { MapZoomControl } from "@/features/map/ui/MapZoomControl";

export function MapView() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [map, setMap] = useState<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current || !GEOAPIFY_API_KEY) {
            return;
        }

        const mapInstance = new maplibregl.Map({
            container: containerRef.current,
            style: getMapStyleUrl(GEOAPIFY_API_KEY),
            center: DEFAULT_MAP_VIEW.center,
            zoom: DEFAULT_MAP_VIEW.zoom,
        });
        mapRef.current = mapInstance;
        setMap(mapInstance);

        return () => {
            mapRef.current = null;
            setMap(null);
            mapInstance.remove();
        };
    }, []);

    if (!GEOAPIFY_API_KEY) {
        return (
            <div
                role="alert"
                className="flex h-full items-center justify-center bg-zinc-50 p-6 text-center dark:bg-black"
            >
                <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                    Geoapify API key is not configured. Set{" "}
                    <code className="font-mono">NEXT_PUBLIC_GEOAPIFY_API_KEY</code> in{" "}
                    <code className="font-mono">apps/web/.env.local</code> and restart the dev server.
                </p>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            <div ref={containerRef} role="region" aria-label="Map" className="h-full w-full" />
            {map && <MapZoomControl map={map} />}
        </div>
    );
}
