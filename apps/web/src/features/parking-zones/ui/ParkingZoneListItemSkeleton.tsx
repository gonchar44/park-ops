import { Skeleton } from "@/shared/ui/skeleton";

/** Placeholder row matching ParkingZoneListItem's layout while zones are loading. */
export function ParkingZoneListItemSkeleton() {
    return (
        <li className="flex items-center justify-between gap-x-3">
            <div className="flex items-start gap-x-2 min-w-0">
                <Skeleton className="mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Skeleton className="h-2.5 w-8" />
                    <Skeleton className="h-3.5 w-28" />
                </div>
            </div>

            <Skeleton className="h-3 w-12 shrink-0" />
        </li>
    );
}
