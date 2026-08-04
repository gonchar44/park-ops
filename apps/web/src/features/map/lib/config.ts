import type maplibregl from "maplibre-gl";

export const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || undefined;

export const DEFAULT_MAP_VIEW = {
    // [longitude, latitude] — Copenhagen
    center: [12.5683, 55.6761] as [number, number],
    zoom: 12,
};

export type MapStyleId = "standard" | "streets" | "satellite";

export const DEFAULT_MAP_STYLE_ID: MapStyleId = "standard";

export const MAP_STYLE_OPTIONS: { id: MapStyleId; label: string; previewSrc: string }[] = [
    { id: "standard", label: "Standard", previewSrc: "/map-styles/standard.webp" },
    { id: "streets", label: "Streets", previewSrc: "/map-styles/streets.webp" },
    { id: "satellite", label: "Satellite", previewSrc: "/map-styles/satellite.webp" },
];

const ESRI_WORLD_IMAGERY_ATTRIBUTION =
    "Powered by Esri | Source: Esri, Maxar, Earthstar Geographics, and the GIS community";

export function getMapStyle(id: MapStyleId, apiKey: string): string | maplibregl.StyleSpecification {
    switch (id) {
        case "standard":
            return `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=${apiKey}`;
        case "streets":
            return `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`;
        case "satellite":
            return {
                version: 8,
                sources: {
                    "esri-world-imagery": {
                        type: "raster",
                        tiles: [
                            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                        ],
                        tileSize: 256,
                        attribution: ESRI_WORLD_IMAGERY_ATTRIBUTION,
                    },
                },
                layers: [{ id: "esri-world-imagery", type: "raster", source: "esri-world-imagery" }],
            };
    }
}
