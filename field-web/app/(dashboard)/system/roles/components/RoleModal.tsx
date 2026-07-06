import React, { useState, useEffect } from "react";
import { RoleRequest, RoleResponse } from "@/core/services/roles.service";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import toast from "react-hot-toast";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RoleRequest, id?: number) => Promise<void>;
  initialData?: RoleResponse | null;
}

export function RoleModal({ isOpen, onClose, onSave, initialData }: RoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || "");
        setIsActive(initialData.isActive);
      } else {
        setName("");
        setDescription("");
        setIsActive(true);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên nhóm quyền!");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({ name, description, isActive }, initialData?.id);
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi lưu thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Chỉnh sửa nhóm quyền" : "Thêm mới nhóm quyền"}
      maxWidth="2xl"
      position="center"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            form="role-form"
          >
            Lưu
          </Button>
        </>
      }
    >
      <form id="role-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên nhóm quyền <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Nhập tên..."
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mô tả
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Nhập mô tả..."
          />
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
            Hoạt động
          </label>
        </div>
      </form>
    </Modal>
  );
}
