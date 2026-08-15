"use client";

import { useToastStore } from "@/shared/lib/toast-store";
import {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/shared/ui/toast";

export function Toaster() {
    const toasts = useToastStore((state) => state.toasts);
    const removeToast = useToastStore((state) => state.removeToast);

    return (
        <ToastProvider>
            {toasts.map(({ id, variant, title, description, icon, action, duration }) => (
                <Toast
                    key={id}
                    variant={variant}
                    icon={icon}
                    duration={duration}
                    onOpenChange={(open) => {
                        if (!open) {
                            removeToast(id);
                        }
                    }}
                >
                    <ToastTitle>{title}</ToastTitle>
                    {description ? <ToastDescription>{description}</ToastDescription> : null}
                    {action ? (
                        <ToastAction altText={action.label} onClick={action.onClick}>
                            {action.label}
                        </ToastAction>
                    ) : null}
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
}
