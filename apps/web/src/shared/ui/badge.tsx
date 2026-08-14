import { cn } from "@/shared/lib/cn";

export type BadgeTone = "success" | "warning" | "danger" | "neutral";

const BADGE_TONE_CLASSES: Record<BadgeTone, { badge: string; dot: string }> = {
    success: {
        badge: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
        dot: "bg-emerald-500 dark:bg-emerald-400",
    },
    warning: {
        badge: "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
        dot: "bg-amber-500 dark:bg-amber-400",
    },
    danger: {
        badge: "bg-red-500/10 text-red-700 dark:bg-red-400/10 dark:text-red-400",
        dot: "bg-red-500 dark:bg-red-400",
    },
    neutral: {
        badge: "bg-zinc-500/10 text-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-300",
        dot: "bg-zinc-500 dark:bg-zinc-400",
    },
};

export type BadgeDotProps = React.ComponentProps<"span"> & {
    tone?: BadgeTone;
};

/** Standalone tone-colored dot. Decorative — pair with a visible text label elsewhere so status isn't color-only. */
export function BadgeDot({ tone = "neutral", className, ...props }: BadgeDotProps) {
    return (
        <span
            aria-hidden="true"
            className={cn("inline-block h-2 w-2 shrink-0 rounded-full", BADGE_TONE_CLASSES[tone].dot, className)}
            {...props}
        />
    );
}

export type BadgeProps = React.ComponentProps<"span"> & {
    tone?: BadgeTone;
};

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                BADGE_TONE_CLASSES[tone].badge,
                className,
            )}
            {...props}
        >
            <BadgeDot tone={tone} />
            {children}
        </span>
    );
}
