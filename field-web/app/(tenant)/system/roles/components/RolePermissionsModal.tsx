import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesService, RoleResponse } from "@/core/services/tenant/roles.service";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleResponse | null;
}

const PERMISSION_GROUPS = [
  {
    name: "Quản lý Người dùng",
    permissions: [
      { id: "Users.View", label: "Xem danh sách" },
      { id: "Users.Create", label: "Thêm mới" },
      { id: "Users.Update", label: "Cập nhật" },
      { id: "Users.Delete", label: "Xóa" },
    ]
  },
  {
    name: "Quản lý Nhóm quyền",
    permissions: [
      { id: "Roles.View", label: "Xem danh sách" },
      { id: "Roles.Create", label: "Thêm mới" },
      { id: "Roles.Update", label: "Cập nhật" },
      { id: "Roles.Delete", label: "Xóa" },
    ]
  }
];

export function RolePermissionsModal({ isOpen, onClose, role }: RolePermissionsModalProps) {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: claimsData, isLoading } = useQuery({
    queryKey: ["role-claims", role?.id],
    queryFn: () => rolesService.getClaims(role!.id),
    enabled: !!role && isOpen,
  });

  useEffect(() => {
    if (claimsData) {
      setSelectedClaims(claimsData);
    } else {
      setSelectedClaims([]);
    }
  }, [claimsData, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (claims: string[]) => rolesService.updateClaims(role!.id, claims),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-claims", role?.id] });
      toast.success("Cập nhật phân quyền thành công!");
      onClose();
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật phân quyền!");
    },
  });

  const handleCheckboxChange = (permissionId: string) => {
    setSelectedClaims((prev) => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllGroup = (group: typeof PERMISSION_GROUPS[0]) => {
    const groupPermIds = group.permissions.map(p => p.id);
    const allSelected = groupPermIds.every(id => selectedClaims.includes(id));
    
    if (allSelected) {
      setSelectedClaims(prev => prev.filter(id => !groupPermIds.includes(id)));
    } else {
      setSelectedClaims(prev => Array.from(new Set([...prev, ...groupPermIds])));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    updateMutation.mutate(selectedClaims);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phân quyền: ${role?.name}`}
      maxWidth="4xl"
      position="center"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={updateMutation.isPending}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={updateMutation.isPending} form="permissions-form">
            Lưu
          </Button>
        </>
      }
    >
      <form id="permissions-form" onSubmit={handleSubmit} className="relative space-y-6">
        <LoadingOverlay isLoading={isLoading} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PERMISSION_GROUPS.map((group, index) => {
            const groupPermIds = group.permissions.map(p => p.id);
            const allSelected = groupPermIds.every(id => selectedClaims.includes(id));
            const someSelected = groupPermIds.some(id => selectedClaims.includes(id));
            
            return (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <input
                    type="checkbox"
                    id={`group-${index}`}
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={() => handleSelectAllGroup(group)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                  />
                  <label htmlFor={`group-${index}`} className="ml-2 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    {group.name}
                  </label>
                </div>
                
                <div className="space-y-3 pl-6">
                  {group.permissions.map((perm) => (
                    <div key={perm.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`perm-${perm.id}`}
                        checked={selectedClaims.includes(perm.id)}
                        onChange={() => handleCheckboxChange(perm.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                      />
                      <label htmlFor={`perm-${perm.id}`} className="ml-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </Modal>
  );
}
