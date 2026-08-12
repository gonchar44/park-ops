"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, XIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import type { ToastVariant } from "@/shared/lib/toast-store";

export function ToastProvider({
    swipeDirection = "right",
    duration = 5000,
    ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
    return <ToastPrimitive.Provider swipeDirection={swipeDirection} duration={duration} {...props} />;
}

export function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
    return (
        <ToastPrimitive.Viewport
            className={cn(
                "fixed right-0 bottom-0 z-100 flex w-full max-w-sm list-none flex-col gap-3 p-6 outline-none",
                className,
            )}
            {...props}
        />
    );
}

type ToastSemanticVariant = Exclude<ToastVariant, "custom">;

const TOAST_VARIANT_ICON: Record<ToastSemanticVariant, React.ComponentType<{ className?: string }>> = {
    success: CheckCircle2Icon,
    info: InfoIcon,
    error: AlertCircleIcon,
};

const TOAST_VARIANT_ACCENT_CLASSES: Record<ToastSemanticVariant, string> = {
    success: "text-emerald-600 dark:text-emerald-400",
    info: "text-sky-600 dark:text-sky-400",
    error: "text-red-600 dark:text-red-400",
};

export type ToastProps = React.ComponentProps<typeof ToastPrimitive.Root> & {
    variant: ToastVariant;
    icon?: React.ReactNode;
};

export function Toast({ variant, icon, className, children, ...props }: ToastProps) {
    const resolvedIcon = variant === "custom" ? icon : resolveVariantIcon(variant);

    return (
        <ToastPrimitive.Root
            className={cn(
                "pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl bg-white/30 p-4 pr-9 text-popover-foreground shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150",
                "data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out motion-reduce:animate-none",
                "data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none",
                "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-200",
                "data-[swipe=end]:animate-toast-swipe-out",
                "dark:bg-white/8 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]",
                className,
            )}
            {...props}
        >
            {resolvedIcon ? <span className="shrink-0">{resolvedIcon}</span> : null}
            <div className="flex flex-1 flex-col gap-1">{children}</div>
        </ToastPrimitive.Root>
    );
}

function resolveVariantIcon(variant: ToastSemanticVariant) {
    const Icon = TOAST_VARIANT_ICON[variant];
    return <Icon className={cn("size-5", TOAST_VARIANT_ACCENT_CLASSES[variant])} />;
}

export function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
    return <ToastPrimitive.Title className={cn("text-sm font-medium", className)} {...props} />;
}

export function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
    return <ToastPrimitive.Description className={cn("text-sm text-popover-foreground/70", className)} {...props} />;
}

export function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
    return (
        <ToastPrimitive.Action
            className={cn(
                "mt-1 inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-white/40 px-3 py-1.5 text-xs font-medium transition-colors select-none hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/50",
                "dark:bg-white/10 dark:hover:bg-white/20 dark:focus-visible:ring-white/50",
                className,
            )}
            {...props}
        />
    );
}

export function ToastClose({
    className,
    "aria-label": ariaLabel = "Dismiss notification",
    ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
    return (
        <ToastPrimitive.Close
            aria-label={ariaLabel}
            className={cn(
                "absolute top-3 right-3 rounded-full p-1 text-popover-foreground/50 transition-colors hover:bg-white/50 hover:text-popover-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/50",
                "dark:hover:bg-white/15 dark:focus-visible:ring-white/50",
                className,
            )}
            {...props}
        >
            <XIcon className="size-4" aria-hidden="true" />
        </ToastPrimitive.Close>
    );
}
