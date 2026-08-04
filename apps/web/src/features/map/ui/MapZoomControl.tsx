"use client";

import { useEffect, useState } from "react";
import type maplibregl from "maplibre-gl";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

type MapZoomControlProps = {
    map: maplibregl.Map;
};

export function MapZoomControl({ map }: MapZoomControlProps) {
    const [zoom, setZoom] = useState(map.getZoom());

    useEffect(() => {
        const handleZoom = () => setZoom(map.getZoom());
        handleZoom();
        map.on("zoom", handleZoom);

        return () => {
            map.off("zoom", handleZoom);
        };
    }, [map]);

    const canZoomIn = zoom < map.getMaxZoom();
    const canZoomOut = zoom > map.getMinZoom();

    return (
        <div
            role="group"
            aria-label="Map zoom"
            className="pointer-events-auto gap-y-1 flex flex-col rounded-full bg-white/30 p-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-white/8 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
        >
            <button
                type="button"
                aria-label="Zoom in"
                title="Zoom in"
                disabled={!canZoomIn}
                onClick={() => map.zoomIn()}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors cursor-pointer",
                    canZoomIn
                        ? "hover:bg-white/50 active:bg-white/70 dark:text-zinc-200 dark:hover:bg-white/15 dark:active:bg-white/20"
                        : "cursor-not-allowed text-zinc-400 dark:text-zinc-600",
                )}
            >
                <PlusIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
            <div className="mx-2 h-px bg-zinc-900/10 dark:bg-white/10" />
            <button
                type="button"
                aria-label="Zoom out"
                title="Zoom out"
                disabled={!canZoomOut}
                onClick={() => map.zoomOut()}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors cursor-pointer",
                    canZoomOut
                        ? "hover:bg-white/50 active:bg-white/70 dark:text-zinc-200 dark:hover:bg-white/15 dark:active:bg-white/20"
                        : "cursor-not-allowed text-zinc-400 dark:text-zinc-600",
                )}
            >
                <MinusIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
        </div>
    );
}
