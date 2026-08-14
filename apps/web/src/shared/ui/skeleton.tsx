import { cn } from "@/shared/lib/cn";

export type SkeletonProps = React.ComponentProps<"div">;

/** Pulsing placeholder block. Caller controls size/shape via className. */
export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "animate-pulse rounded-md bg-zinc-200 motion-reduce:animate-none dark:bg-white/10",
                className,
            )}
            {...props}
        />
    );
}
