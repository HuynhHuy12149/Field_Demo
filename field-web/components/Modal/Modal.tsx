import React, { ReactNode } from "react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  position?: "center" | "top";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
  position = "center"
}: ModalProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  }[maxWidth];

  const positionClass = position === "top" ? "items-start pt-32" : "items-center";

  return (
    <Dialog open={isOpen} onClose={() => onClose && onClose()} className="relative z-[100]">
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-150 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in"
      />

      {/* Container */}
      <div className={`fixed inset-0 flex w-screen justify-center overflow-y-auto overflow-x-hidden p-4 ${positionClass}`}>
        {/* Modal Panel */}
        <DialogPanel
          transition
          className={`relative w-full ${maxWidthClass} rounded-xl bg-white text-left shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[closed]:translate-y-4 data-[enter]:duration-150 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in`}
        >
          {/* Header */}
          {title && (
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                {title}
              </h3>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex justify-end space-x-3">
              {footer}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
