"use client";

import type maplibregl from "maplibre-gl";
import Image from "next/image";
import { CheckIcon, LayersIcon } from "lucide-react";

import { MAP_STYLE_OPTIONS, type MapStyleId } from "@/features/map/lib/config";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "@/shared/ui/radio-group";

type MapStyleControlProps = {
    map: maplibregl.Map;
    styleId: MapStyleId;
    onStyleChange: (id: MapStyleId) => void;
};

export function MapStyleControl({ styleId, onStyleChange }: MapStyleControlProps) {
    const selectedLabel = MAP_STYLE_OPTIONS.find((option) => option.id === styleId)?.label ?? styleId;

    return (
        <Popover>
            <div
                role="group"
                aria-label="Map style"
                className="pointer-events-auto flex rounded-full bg-white/30 p-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-white/8 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
            >
                <PopoverTrigger
                    type="button"
                    aria-label={`Map style: ${selectedLabel}`}
                    title="Map style"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-black transition-colors hover:bg-white/50 active:bg-white/70 dark:text-zinc-200 dark:hover:bg-white/15 dark:active:bg-white/20"
                >
                    <LayersIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                </PopoverTrigger>
            </div>
            <PopoverContent align="end" className="w-auto p-2">
                <RadioGroup
                    value={styleId}
                    onValueChange={(value) => onStyleChange(value as MapStyleId)}
                    aria-label="Map style"
                    className="grid grid-cols-3 gap-2"
                >
                    {MAP_STYLE_OPTIONS.map((option) => (
                        <RadioGroupItem
                            key={option.id}
                            value={option.id}
                            className="flex flex-col items-center gap-1.5 p-1 rounded-2xl"
                        >
                            <span className="relative size-16 overflow-hidden rounded-xl ring-2 ring-transparent ring-offset-2 ring-offset-popover transition-colors group-data-[state=checked]:ring-zinc-900 dark:group-data-[state=checked]:ring-white">
                                <Image src={option.previewSrc} alt="" fill sizes="64px" className="object-cover" />
                                <RadioGroupIndicator className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                    <CheckIcon aria-hidden="true" className="size-2.5" strokeWidth={3} />
                                </RadioGroupIndicator>
                            </span>
                            <span className="text-xs text-zinc-600 transition-colors group-data-[state=checked]:font-medium group-data-[state=checked]:text-zinc-900 dark:text-zinc-400 dark:group-data-[state=checked]:text-zinc-50">
                                {option.label}
                            </span>
                        </RadioGroupItem>
                    ))}
                </RadioGroup>
            </PopoverContent>
        </Popover>
    );
}
