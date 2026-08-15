import { useEffect, useMemo, useRef } from "react";
import type maplibregl from "maplibre-gl";

import { useParkingZones } from "@/features/parking-zones/api/zones-queries";
import { PARKING_ZONE_STATUSES, type ParkingZoneStatus } from "@/features/parking-zones/api/zones";
import { toZonesFeatureCollection, type ParkingZonesFeatureCollection } from "@/features/parking-zones/lib/geojson";
import { PARKING_ZONE_STATUS_STYLES } from "@/features/parking-zones/lib/zone-styles";

const PARKING_ZONES_SOURCE_ID = "parking-zones-source";
const PARKING_ZONES_FILL_LAYER_ID = "parking-zones-fill";

function outlineLayerId(status: ParkingZoneStatus): string {
    return `parking-zones-outline-${status}`;
}

const EMPTY_FEATURE_COLLECTION: ParkingZonesFeatureCollection = {
    type: "FeatureCollection",
    features: [],
};

/**
 * MapLibre's fill-color/fill-opacity are true data-driven paint properties, so a single
 * fill layer can key off the `status` feature property with a match expression. `line-dasharray`
 * is a "cross-faded" paint property and does not support per-feature data expressions, so the
 * outline is one static line layer per status instead of a single data-driven one.
 */
function addParkingZonesLayers(map: maplibregl.Map, initialData: ParkingZonesFeatureCollection): void {
    if (map.getSource(PARKING_ZONES_SOURCE_ID)) {
        return;
    }

    map.addSource(PARKING_ZONES_SOURCE_ID, {
        type: "geojson",
        data: initialData,
    });

    // The match expression's branch values are dynamically assembled from PARKING_ZONE_STATUS_STYLES,
    // which MapLibre's TypeScript definitions don't model precisely as a data-driven expression.
    const fillColorExpression = [
        "match",
        ["get", "status"],
        ...PARKING_ZONE_STATUSES.flatMap((status) => [status, PARKING_ZONE_STATUS_STYLES[status].fillColor]),
        "#000000",
    ] as unknown as maplibregl.PropertyValueSpecification<string>;
    const fillOpacityExpression = [
        "match",
        ["get", "status"],
        ...PARKING_ZONE_STATUSES.flatMap((status) => [status, PARKING_ZONE_STATUS_STYLES[status].fillOpacity]),
        0,
    ] as unknown as maplibregl.PropertyValueSpecification<number>;

    map.addLayer({
        id: PARKING_ZONES_FILL_LAYER_ID,
        type: "fill",
        source: PARKING_ZONES_SOURCE_ID,
        paint: {
            "fill-color": fillColorExpression,
            "fill-opacity": fillOpacityExpression,
        },
    });

    for (const status of PARKING_ZONE_STATUSES) {
        const style = PARKING_ZONE_STATUS_STYLES[status];
        map.addLayer({
            id: outlineLayerId(status),
            type: "line",
            source: PARKING_ZONES_SOURCE_ID,
            filter: ["==", ["get", "status"], status],
            paint: {
                "line-color": style.lineColor,
                "line-width": style.lineWidth,
                "line-dasharray": style.lineDasharray,
            },
        });
    }
}

function removeParkingZonesLayers(map: maplibregl.Map): void {
    for (const status of PARKING_ZONE_STATUSES) {
        if (map.getLayer(outlineLayerId(status))) {
            map.removeLayer(outlineLayerId(status));
        }
    }
    if (map.getLayer(PARKING_ZONES_FILL_LAYER_ID)) {
        map.removeLayer(PARKING_ZONES_FILL_LAYER_ID);
    }
    if (map.getSource(PARKING_ZONES_SOURCE_ID)) {
        map.removeSource(PARKING_ZONES_SOURCE_ID);
    }
}

export function useParkingZonesLayer(map: maplibregl.Map | null, cityId: string | null): void {
    const zonesQuery = useParkingZones(cityId);
    const featureCollection = useMemo(
        () => (zonesQuery.data ? toZonesFeatureCollection(zonesQuery.data) : EMPTY_FEATURE_COLLECTION),
        [zonesQuery.data],
    );

    // Mirrors featureCollection into a ref (outside render) so the style.load handler below can
    // read the latest zones without depending on it — re-running that whole effect on every data
    // change would tear down and re-add the layers unnecessarily.
    const featureCollectionRef = useRef(featureCollection);
    useEffect(() => {
        featureCollectionRef.current = featureCollection;
    }, [featureCollection]);

    useEffect(() => {
        if (!map) {
            return;
        }

        function ensureLayers() {
            if (map && !map.getSource(PARKING_ZONES_SOURCE_ID)) {
                addParkingZonesLayers(map, featureCollectionRef.current);
            }
        }

        // isStyleLoaded() is an idle check, not a readiness check: it also reports false while base
        // tiles or sprite images are still in flight. True proves the style accepts addSource, false
        // proves nothing, so it is only a fast path here and readiness comes from events.
        if (map.isStyleLoaded()) {
            ensureLayers();
        }
        // Re-add after every style (re)load: MapStyleControl calls map.setStyle(...), which tears
        // down all custom sources/layers on the previous style.
        map.on("style.load", ensureLayers);
        // `map` is React state, so this effect runs a render after the map is constructed. A cached
        // style can finish inside that window and its style.load would be missed; `load` fires once
        // after the first full render, well past that window, and catches it.
        map.on("load", ensureLayers);

        return () => {
            map.off("style.load", ensureLayers);
            map.off("load", ensureLayers);
            removeParkingZonesLayers(map);
        };
    }, [map]);

    // Gated on the source existing rather than on style idleness: setData is safe while tiles load,
    // and when the source is absent (first load, or the setStyle window) featureCollectionRef already
    // holds this collection for the next ensureLayers.
    useEffect(() => {
        const source = map?.getSource(PARKING_ZONES_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
        source?.setData(featureCollection);
    }, [map, featureCollection]);
}
