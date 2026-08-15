"use client";

import { useEffect, useState } from "react";
import type maplibregl from "maplibre-gl";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";

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
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Zoom in"
                title="Zoom in"
                disabled={!canZoomIn}
                onClick={() => map.zoomIn()}
            >
                <PlusIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Button>
            <div className="mx-2 h-px bg-zinc-900/10 dark:bg-white/10" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Zoom out"
                title="Zoom out"
                disabled={!canZoomOut}
                onClick={() => map.zoomOut()}
            >
                <MinusIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Button>
        </div>
    );
}
