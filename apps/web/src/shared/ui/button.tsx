import { cn } from "@/shared/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: cn(
        "bg-zinc-900 text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] hover:bg-zinc-800 active:bg-zinc-950",
        "dark:bg-white/90 dark:text-zinc-900 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] dark:hover:bg-white dark:active:bg-white/80",
    ),
    secondary: cn(
        "bg-white/30 text-zinc-900 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 hover:bg-white/50 active:bg-white/70",
        "dark:bg-white/8 dark:text-zinc-100 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] dark:hover:bg-white/15 dark:active:bg-white/20",
    ),
    ghost: cn(
        "text-zinc-700 hover:bg-white/50 active:bg-white/70",
        "dark:text-zinc-300 dark:hover:bg-white/15 dark:active:bg-white/20",
    ),
};

const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: "h-8 gap-1.5 px-3 text-xs",
    md: "h-9 gap-2 px-4 text-sm",
    lg: "h-11 gap-2 px-6 text-base",
    icon: "h-9 w-9 p-0",
};

export type ButtonProps = React.ComponentProps<"button"> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/50 focus-visible:ring-offset-2 ring-offset-popover dark:focus-visible:ring-white/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                BUTTON_VARIANT_CLASSES[variant],
                BUTTON_SIZE_CLASSES[size],
                className,
            )}
            {...props}
        />
    );
}
