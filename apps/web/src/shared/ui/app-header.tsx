"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Lock } from "lucide-react";

import { cn } from "@/shared/lib/cn";

type NavItem = {
    label: string;
    href: string;
    disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Map", href: "/map" },
    { label: "Sessions", href: "/sessions", disabled: true },
    { label: "Reports", href: "/reports", disabled: true },
    { label: "Settings", href: "/settings", disabled: true },
];

const ACTIVE_PILL_LAYOUT_ID = "app-header-active-pill";

export function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
            <nav
                aria-label="Primary"
                className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/30 p-1.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-white/8 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
            >
                {NAV_ITEMS.map((item) => {
                    const isActive = !item.disabled && pathname === item.href;

                    if (item.disabled) {
                        return (
                            <span
                                key={item.href}
                                aria-disabled="true"
                                title="Coming soon"
                                className="flex cursor-not-allowed items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-zinc-400 select-none dark:text-zinc-500"
                            >
                                {item.label}
                                <Lock aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "text-zinc-900 dark:text-zinc-50"
                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                            )}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId={ACTIVE_PILL_LAYOUT_ID}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/15"
                                />
                            )}
                            <span className="relative">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
