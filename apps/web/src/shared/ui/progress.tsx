"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/shared/lib/cn";

export type ProgressTone = "success" | "warning" | "danger" | "neutral";
export type ProgressOrientation = "horizontal" | "vertical";

export type ProgressThreshold = {
    /** Inclusive lower bound, in percent of `max`. */
    min: number;
    tone: ProgressTone;
};

const DEFAULT_THRESHOLDS: ProgressThreshold[] = [{ min: 0, tone: "success" }];

const PROGRESS_TONE_CLASSES: Record<ProgressTone, { indicator: string; label: string }> = {
    success: { indicator: "bg-emerald-500 dark:bg-emerald-400", label: "text-emerald-600 dark:text-emerald-400" },
    warning: { indicator: "bg-amber-500 dark:bg-amber-400", label: "text-amber-600 dark:text-amber-400" },
    danger: { indicator: "bg-red-500 dark:bg-red-400", label: "text-red-600 dark:text-red-400" },
    neutral: { indicator: "bg-zinc-400 dark:bg-zinc-500", label: "text-zinc-600 dark:text-zinc-400" },
};

/** Resolves the tone for `percent` as the last threshold whose `min` it meets or exceeds. */
export function resolveProgressTone(percent: number, thresholds: ProgressThreshold[]): ProgressTone {
    let resolved: ProgressTone = "neutral";
    for (const threshold of thresholds) {
        if (percent >= threshold.min) {
            resolved = threshold.tone;
        }
    }
    return resolved;
}

export type ProgressProps = Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value" | "max"> & {
    value: number;
    max?: number;
    orientation?: ProgressOrientation;
    thresholds?: ProgressThreshold[];
    showLabel?: boolean;
};

export function Progress({
    value,
    max = 100,
    orientation = "horizontal",
    thresholds = DEFAULT_THRESHOLDS,
    showLabel = true,
    className,
    ...props
}: ProgressProps) {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    const tone = resolveProgressTone(percent, thresholds);
    const label = showLabel ? (
        <span className={cn("text-xs font-medium", PROGRESS_TONE_CLASSES[tone].label)}>{Math.round(percent)}%</span>
    ) : null;

    if (orientation === "vertical") {
        return (
            <div className={cn("flex flex-row items-center gap-2", className)}>
                <ProgressPrimitive.Root
                    value={value}
                    max={max}
                    aria-orientation="vertical"
                    className="relative h-24 w-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"
                    {...props}
                >
                    <ProgressPrimitive.Indicator
                        className={cn(
                            "absolute bottom-0 left-0 w-full rounded-full transition-[height] duration-300 ease-out",
                            PROGRESS_TONE_CLASSES[tone].indicator,
                        )}
                        style={{ height: `${percent}%` }}
                    />
                </ProgressPrimitive.Root>
                {label}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label}
            <ProgressPrimitive.Root
                value={value}
                max={max}
                className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"
                {...props}
            >
                <ProgressPrimitive.Indicator
                    className={cn(
                        "h-full rounded-full transition-[width] duration-300 ease-out",
                        PROGRESS_TONE_CLASSES[tone].indicator,
                    )}
                    style={{ width: `${percent}%` }}
                />
            </ProgressPrimitive.Root>
        </div>
    );
}
