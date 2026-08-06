import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { DEFAULT_MAP_STYLE_ID, isMapStyleId, type MapStyleId } from "@/features/map/lib/config";

const MAP_STORE_VERSION = 2;

type LocationFilterId = string | null;

type MapState = {
    mapStyleId: MapStyleId;
    setMapStyleId: (id: MapStyleId) => void;
    countryId: LocationFilterId;
    municipalityId: LocationFilterId;
    cityId: LocationFilterId;
    setCountryId: (id: LocationFilterId) => void;
    setMunicipalityId: (id: LocationFilterId) => void;
    setCityId: (id: LocationFilterId) => void;
};

function isLocationFilterId(value: unknown): value is LocationFilterId {
    return typeof value === "string" || value === null;
}

export const useMapStore = create<MapState>()(
    devtools(
        persist(
            (set) => ({
                mapStyleId: DEFAULT_MAP_STYLE_ID,
                setMapStyleId: (id) => set({ mapStyleId: id }, false, "setMapStyleId"),
                countryId: null,
                municipalityId: null,
                cityId: null,
                setCountryId: (id) => set({ countryId: id, municipalityId: null, cityId: null }, false, "setCountryId"),
                setMunicipalityId: (id) => set({ municipalityId: id, cityId: null }, false, "setMunicipalityId"),
                setCityId: (id) => set({ cityId: id }, false, "setCityId"),
            }),
            {
                name: "parkops-map-store",
                version: MAP_STORE_VERSION,
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    mapStyleId: state.mapStyleId,
                    countryId: state.countryId,
                    municipalityId: state.municipalityId,
                    cityId: state.cityId,
                }),
                merge: (persistedState, currentState) => {
                    const persisted = persistedState as Partial<MapState> | undefined;
                    const mapStyleId = isMapStyleId(persisted?.mapStyleId)
                        ? persisted.mapStyleId
                        : DEFAULT_MAP_STYLE_ID;
                    const countryId = isLocationFilterId(persisted?.countryId) ? persisted.countryId : null;
                    const municipalityId = isLocationFilterId(persisted?.municipalityId)
                        ? persisted.municipalityId
                        : null;
                    const cityId = isLocationFilterId(persisted?.cityId) ? persisted.cityId : null;
                    return { ...currentState, mapStyleId, countryId, municipalityId, cityId };
                },
            },
        ),
        {
            name: "MapStore",
            enabled: process.env.NODE_ENV === "development",
        },
    ),
);
