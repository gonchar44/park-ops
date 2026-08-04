import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { DEFAULT_MAP_STYLE_ID, type MapStyleId } from "@/features/map/lib/config";

const MAP_STORE_VERSION = 1;

type MapState = {
    mapStyleId: MapStyleId;
    setMapStyleId: (id: MapStyleId) => void;
};

export const useMapStore = create<MapState>()(
    devtools(
        persist(
            (set) => ({
                mapStyleId: DEFAULT_MAP_STYLE_ID,
                setMapStyleId: (id) => set({ mapStyleId: id }, false, "setMapStyleId"),
            }),
            {
                name: "parkops-map-store",
                version: MAP_STORE_VERSION,
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ mapStyleId: state.mapStyleId }),
            },
        ),
        {
            name: "MapStore",
            enabled: process.env.NODE_ENV === "development",
        },
    ),
);
