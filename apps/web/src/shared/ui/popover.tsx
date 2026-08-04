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
                    "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-lg border border-zinc-200 bg-popover p-4 text-popover-foreground shadow-lg outline-none",
                    "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out motion-reduce:animate-none",
                    "dark:border-zinc-800",
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}
