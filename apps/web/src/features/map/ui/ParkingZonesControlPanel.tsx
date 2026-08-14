"use client";

import { LocationFilters } from "@/features/map/ui/LocationFilters";
import { useMapStore } from "@/features/map/model/map-store";
import { ParkingZonesList } from "@/features/parking-zones/ui/ParkingZonesList";
import { Card } from "@/shared/ui/card";

export function ParkingZonesControlPanel() {
    const cityId = useMapStore((state) => state.cityId);

    return (
        <Card className="pointer-events-auto w-72 gap-3 py-4">
            <LocationFilters />
            <ParkingZonesList cityId={cityId} />
        </Card>
    );
}
