"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/shared/lib/cn";

export const RadioGroup = RadioGroupPrimitive.Root;

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            className={cn(
                "group cursor-pointer rounded-lg transition-colors hover:bg-white/50 dark:hover:bg-white/15",
                className,
            )}
            {...props}
        />
    );
}

export function RadioGroupIndicator({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Indicator>) {
    return <RadioGroupPrimitive.Indicator className={cn(className)} {...props} />;
}
