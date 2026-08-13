"use client";

import { LocationFilters } from "@/features/map/ui/LocationFilters";
import { Card } from "@/shared/ui/card";

export function ParkingZonesControlPanel() {
    return (
        <Card className="pointer-events-auto w-72 gap-3 py-4">
            <LocationFilters />
        </Card>
    );
}
