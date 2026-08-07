"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { DEFAULT_MAP_VIEW, GEOAPIFY_API_KEY, getMapStyle, type MapStyleId } from "@/features/map/lib/config";
import { useMapStore } from "@/features/map/model/map-store";
import { LocationFiltersCard } from "@/features/map/ui/LocationFiltersCard";
import { MapStyleControl } from "@/features/map/ui/MapStyleControl";
import { MapZoomControl } from "@/features/map/ui/MapZoomControl";
import { useParkingZonesLayer } from "@/features/parking-zones/ui/useParkingZonesLayer";

export function MapView() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [map, setMap] = useState<maplibregl.Map | null>(null);
    const styleId = useMapStore((state) => state.mapStyleId);
    const setMapStyleId = useMapStore((state) => state.setMapStyleId);
    const cityId = useMapStore((state) => state.cityId);

    useParkingZonesLayer(map, cityId);

    useEffect(() => {
        if (!containerRef.current || !GEOAPIFY_API_KEY) {
            return;
        }

        const mapInstance = new maplibregl.Map({
            container: containerRef.current,
            style: getMapStyle(useMapStore.getState().mapStyleId, GEOAPIFY_API_KEY),
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

    function handleStyleChange(id: MapStyleId) {
        if (!GEOAPIFY_API_KEY) {
            return;
        }

        setMapStyleId(id);
        mapRef.current?.setStyle(getMapStyle(id, GEOAPIFY_API_KEY));
    }

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

            {map && (
                <>
                    <div className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 sm:left-6">
                        <LocationFiltersCard />
                    </div>
                    <div className="pointer-events-none absolute top-1/2 right-4 z-10 flex -translate-y-1/2 flex-col items-end gap-3 sm:right-6">
                        <MapStyleControl map={map} styleId={styleId} onStyleChange={handleStyleChange} />
                        <MapZoomControl map={map} />
                    </div>
                </>
            )}
        </div>
    );
}
