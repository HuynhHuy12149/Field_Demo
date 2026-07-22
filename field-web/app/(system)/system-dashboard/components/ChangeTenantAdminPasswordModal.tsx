"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { systemTenantService } from "@/core/services/system/system-tenant.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal/Modal";

interface ChangeTenantAdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: number;
}

export const ChangeTenantAdminPasswordModal: React.FC<ChangeTenantAdminPasswordModalProps> = ({ 
  isOpen, 
  onClose,
  tenantId
}) => {
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
      await systemTenantService.changeAdminPassword(tenantId, { newPassword });
      toast.success("Cấp lại mật khẩu Admin thành công!");
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Đã xảy ra lỗi khi cấp lại mật khẩu.";
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
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <KeyRound size={20} />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">Cấp lại mật khẩu</div>
            <div className="text-sm font-normal text-slate-500 dark:text-slate-400">Tạo mật khẩu mới cho Admin</div>
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
            form="change-tenant-password-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Cấp lại mật khẩu"}
          </Button>
        </div>
      }
    >
      <form id="change-tenant-password-form" onSubmit={handleSubmit} className="space-y-4">
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
