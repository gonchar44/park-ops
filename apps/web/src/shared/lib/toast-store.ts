import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ToastVariant = "success" | "info" | "error" | "custom";

export type ToastAction = {
    label: string;
    onClick: () => void;
};

export type ToastEntry = {
    id: string;
    variant: ToastVariant;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: ToastAction;
    duration?: number;
};

export type ToastInput = Omit<ToastEntry, "id" | "variant"> & {
    icon?: React.ReactNode;
};

export type ToastOptions = {
    description?: string;
    action?: ToastAction;
    duration?: number;
};

export type CustomToastOptions = ToastOptions & {
    icon?: React.ReactNode;
};

type ToastState = {
    toasts: ToastEntry[];
    addToast: (variant: ToastVariant, input: ToastInput) => string;
    removeToast: (id: string) => void;
};

const useToastStore = create<ToastState>()(
    devtools(
        (set) => ({
            toasts: [],
            addToast: (variant, input) => {
                const id = crypto.randomUUID();
                set((state) => ({ toasts: [...state.toasts, { id, variant, ...input }] }), false, "addToast");
                return id;
            },
            removeToast: (id) => {
                set((state) => ({ toasts: state.toasts.filter((entry) => entry.id !== id) }), false, "removeToast");
            },
        }),
        {
            name: "ToastStore",
            enabled: process.env.NODE_ENV === "development",
        },
    ),
);

export { useToastStore };

export const toast = {
    success: (message: string, options?: ToastOptions) =>
        useToastStore.getState().addToast("success", { title: message, ...options }),
    info: (message: string, options?: ToastOptions) =>
        useToastStore.getState().addToast("info", { title: message, ...options }),
    error: (message: string, options?: ToastOptions) =>
        useToastStore.getState().addToast("error", { title: message, ...options }),
    custom: (message: string, options?: CustomToastOptions) =>
        useToastStore.getState().addToast("custom", { title: message, ...options }),
    dismiss: (id: string) => useToastStore.getState().removeToast(id),
};
