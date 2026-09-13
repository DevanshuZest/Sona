"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; message: string; kind: ToastKind };
type ToastContextValue = {
    show(message: string, kind?: ToastKind): void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const nextId = useRef(0);

    const show = (message: string, kind: ToastKind = "info") => {
        const id = nextId.current++;
        setToasts((current) => [...current, { id, message, kind }]);
        window.setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div className="sona-toast fixed top-4 left-1/2 z-[70] flex -translate-x-1/2 flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        aria-live="polite"
                        className={`animate-[sona-toast-in_200ms_ease-out] min-w-56 rounded-lg border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] px-4 py-2 text-sm shadow-md ${toast.kind === "success"
                                ? "border-l-4 border-l-[hsl(var(--sona-text-success))]"
                                : toast.kind === "error"
                                    ? "border-l-4 border-l-[hsl(var(--sona-text-danger))]"
                                    : "border-l-4 border-l-[hsl(var(--sona-text-brand))]"
                            }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}