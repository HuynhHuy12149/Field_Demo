import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  position = "center",
}: ModalProps) {
  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    "6xl": "sm:max-w-6xl",
    "7xl": "sm:max-w-7xl",
    full: "sm:max-w-[calc(100vw-2rem)]",
  }[maxWidth];

  const positionClass = position === "top" ? "translate-y-0 top-32" : "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className={`${maxWidthClass} ${positionClass} p-0 overflow-hidden`}>
        {title && (
          <DialogHeader className="px-6 py-4 border-b border-border m-0">
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="px-6 py-4">
          {children}
        </div>
        {footer && (
          <DialogFooter className="px-6 py-4 bg-muted/50 border-t border-border m-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
