import React, { useState, useEffect } from "react";
import { UserRequest, UserResponse } from "@/core/services/tenant/users.service";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { validateFields } from "@/core/utils/validation";
import { useQuery } from "@tanstack/react-query";
import { rolesService } from "@/core/services/tenant/roles.service";
import { ChevronDown } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserRequest, id?: number) => Promise<void>;
  initialData?: UserResponse | null;
}

export function UserModal({ isOpen, onClose, onSave, initialData }: UserModalProps) {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password?: string;
    isActive: boolean;
    roleIds: number[];
  }>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    isActive: true,
    roleIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const { data: rolesData } = useQuery({
    queryKey: ["roles-all"],
    queryFn: () => rolesService.getAll({ pageIndex: 1, pageSize: 100 }), // Get all roles
    enabled: isOpen
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          fullName: initialData.fullName,
          email: initialData.email,
          phone: initialData.phone || "",
          address: initialData.address || "",
          password: "", // Không hiển thị mật khẩu cũ khi edit
          isActive: initialData.isActive,
          roleIds: initialData.roleIds || [],
        });
      } else {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          isActive: true,
          roleIds: [],
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;

    // Nếu là checkbox thì lấy checked thay vì value
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const toggleRole = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const validateForm = () => {
    const fieldsToValidate = [
      { value: formData.fullName, errorMessage: "Vui lòng nhập Họ tên!" },
      { value: formData.email, errorMessage: "Vui lòng nhập Email!" },
    ];

    // Khi thêm mới thì bắt buộc nhập mật khẩu
    if (!initialData) {
      fieldsToValidate.push({ value: formData.password || "", errorMessage: "Vui lòng nhập mật khẩu!" });
    }

    return validateFields(fieldsToValidate);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSave(formData, initialData?.id);
    } catch {
      // Đã bắt lỗi ở nơi gọi hàm onSave
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Cập nhật Người dùng" : "Thêm Người dùng"}
      maxWidth="3xl"
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
            form="user-form"
          >
            Lưu
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập họ tên..."
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập email..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Mật khẩu {initialData ? "(Để trống nếu không muốn đổi)" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập mật khẩu..."
              required={initialData ? false : true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập địa chỉ..."
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nhóm quyền
            </label>
            <div
              className="mt-1 flex w-full justify-between items-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white cursor-pointer hover:border-blue-500 focus:outline-none"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            >
              <span className="truncate text-slate-700 dark:text-slate-300">
                {formData.roleIds.length > 0 && rolesData?.data
                  ? rolesData.data
                    .filter((r) => formData.roleIds.includes(r.id))
                    .map((r) => r.name)
                    .join(", ")
                  : <span className="text-slate-400">Chọn nhóm quyền...</span>}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
            </div>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsRoleDropdownOpen(false)}
                ></div>
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {rolesData?.data?.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                      onClick={() => toggleRole(role.id)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.roleIds.includes(role.id)}
                        onChange={() => { }} // Handle bằng onClick thẻ div bao ngoài
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 mr-3 pointer-events-none"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{role.name}</span>
                    </div>
                  ))}
                  {(!rolesData?.data || rolesData.data.length === 0) && (
                    <div className="px-3 py-2 text-sm text-slate-500 text-center">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
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
