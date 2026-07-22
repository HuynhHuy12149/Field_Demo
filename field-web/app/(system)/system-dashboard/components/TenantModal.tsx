"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function TenantModal({ isOpen, onClose, onSave, isLoading }: TenantModalProps) {
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminFullName, setAdminFullName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [type, setType] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 0) {
      // Có thể thêm toast warning ở đây nếu cần, tạm thời block lại
      return;
    }
    await onSave({
      name,
      adminEmail,
      adminFullName,
      adminPassword,
      type
    });
    // Reset form after save (handled in parent or here)
    setName("");
    setAdminEmail("");
    setAdminFullName("");
    setAdminPassword("");
    setType(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm mới Khách hàng (Tenant)"
      maxWidth="md"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white" form="tenant-form" disabled={isLoading || type === 0}>
            {isLoading ? "Đang xử lý..." : "Khởi tạo & Lưu"}
          </Button>
        </div>
      }
    >
      <form id="tenant-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Công ty/Khách hàng <span className="text-red-500">*</span></label>
          <input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            placeholder="Nhập tên khách hàng"
            className="block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại hình <span className="text-red-500">*</span></label>
          <Select value={type === 0 ? undefined : type.toString()} onValueChange={(val) => setType(Number(val))}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 h-10 px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-md">
              <SelectValue placeholder="Chọn loại hình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Field Service</SelectItem>
              <SelectItem value="2">Class/Education</SelectItem>
              <SelectItem value="3">ERP System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-2 border-slate-200 dark:border-slate-700">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ Tên Admin <span className="text-red-500">*</span></label>
              <input
                value={adminFullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminFullName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                className="block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Admin <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminEmail(e.target.value)}
                required
                placeholder="admin@tenant.com"
                className="block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminPassword(e.target.value)}
                required
                placeholder="Mật khẩu đăng nhập"
                className="block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
