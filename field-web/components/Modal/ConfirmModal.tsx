import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../Button/Button";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isLoading = false
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      position="top"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 pt-2">
        <div className="flex-shrink-0 p-3 bg-red-100 dark:bg-red-500/20 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
