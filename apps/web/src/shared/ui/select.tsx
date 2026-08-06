"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

export const Select = SelectPrimitive.Root;

export const SelectGroup = SelectPrimitive.Group;

export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
    return (
        <SelectPrimitive.Trigger
            className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-2 outline-none",
                "data-disabled:cursor-not-allowed data-disabled:opacity-50",
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 opacity-60" strokeWidth={2} />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

export function SelectContent({
    className,
    children,
    position = "popper",
    sideOffset = 6,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                position={position}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden rounded-2xl bg-white/30 p-1 text-popover-foreground shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] outline-none backdrop-blur-2xl backdrop-saturate-150",
                    "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out motion-reduce:animate-none",
                    "dark:bg-zinc-900/70 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]",
                    className,
                )}
                {...props}
            >
                <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            className={cn(
                "relative flex cursor-pointer items-center rounded-lg py-1.5 pr-8 pl-2.5 text-sm outline-none select-none",
                "data-highlighted:bg-white/50 dark:data-highlighted:bg-white/10",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="absolute right-2.5 flex items-center">
                <CheckIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
}
