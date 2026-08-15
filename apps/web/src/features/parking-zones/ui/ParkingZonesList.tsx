"use client";

import { useParkingZones } from "@/features/parking-zones/api/zones-queries";
import { ParkingZoneListItem } from "@/features/parking-zones/ui/ParkingZoneListItem";
import { ParkingZoneListItemSkeleton } from "@/features/parking-zones/ui/ParkingZoneListItemSkeleton";

type ParkingZonesListProps = {
    cityId: string | null;
};

const LOADING_SKELETON_ROW_COUNT = 3;

function ParkingZonesListMessage({ children }: { children: React.ReactNode }) {
    return <p className="px-4 text-xs text-zinc-500 dark:text-zinc-400">{children}</p>;
}

export function ParkingZonesList({ cityId }: ParkingZonesListProps) {
    const zonesQuery = useParkingZones(cityId);
    const zones = zonesQuery.data ?? [];

    return (
        <div className="flex flex-col gap-2">
            <h2 className="px-4 text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Parking zones
            </h2>
            {cityId === null ? (
                <ParkingZonesListMessage>Select a city to view its parking zones.</ParkingZonesListMessage>
            ) : zonesQuery.isLoading ? (
                <>
                    <span className="sr-only">Loading parking zones…</span>
                    <ul aria-busy="true" className="flex max-h-80 flex-col gap-4 overflow-y-auto px-4">
                        {Array.from({ length: LOADING_SKELETON_ROW_COUNT }, (_, index) => (
                            <ParkingZoneListItemSkeleton key={index} />
                        ))}
                    </ul>
                </>
            ) : zonesQuery.isError ? (
                <ParkingZonesListMessage>Failed to load parking zones.</ParkingZonesListMessage>
            ) : zones.length === 0 ? (
                <ParkingZonesListMessage>No parking zones in this city.</ParkingZonesListMessage>
            ) : (
                <ul className="flex max-h-80 flex-col gap-4 overflow-y-auto px-4">
                    {zones.map((zone) => (
                        <ParkingZoneListItem key={zone.id} zone={zone} />
                    ))}
                </ul>
            )}
        </div>
    );
}
