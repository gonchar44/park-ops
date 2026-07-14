import type { Metadata } from "next";

import { MapView } from "@/features/map/ui/MapView";

export const metadata: Metadata = {
    title: "Map",
};

export default function MapPage() {
    return (
        <main className="h-dvh">
            <MapView />
        </main>
    );
}
