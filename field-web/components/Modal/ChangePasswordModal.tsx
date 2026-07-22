"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { systemAuthService } from "@/core/services/system/system-auth.service";
import { authService } from "@/core/services/tenant/auth.service";
import { useAuthStore } from "@/core/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal/Modal";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      const data = {
        newPassword: newPassword,
      };

      if (user?.type === "SuperAdmin") {
        response = await systemAuthService.changePassword(data);
      } else {
        response = await authService.changePassword(data);
      }

      toast.success("Đổi mật khẩu thành công!");
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <KeyRound size={20} />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Đổi mật khẩu</div>
            <div className="text-sm font-normal text-slate-500 dark:text-slate-400">Cập nhật mật khẩu bảo mật mới</div>
          </div>
        </div>
      }
      maxWidth="md"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            form="change-password-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </div>
      }
    >
      <form id="change-password-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Mật khẩu mới <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Xác nhận mật khẩu mới <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
