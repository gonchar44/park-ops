"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/shared/lib/cn";

export const Popover = PopoverPrimitive.Root;

export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverAnchor = PopoverPrimitive.Anchor;

export function PopoverContent({
    className,
    align = "center",
    sideOffset = 8,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-2xl bg-white/30 p-4 text-popover-foreground shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] outline-none backdrop-blur-2xl backdrop-saturate-150",
                    "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out motion-reduce:animate-none",
                    "dark:bg-white/8 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]",
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}
