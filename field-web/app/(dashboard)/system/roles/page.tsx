"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/Table/DataTable";
import { RolesHeader } from "./components/RolesHeader";
import { RolesSearch } from "./components/RolesSearch";
import { getColumns } from "./components/columns";
import { RoleModal } from "./components/RoleModal";
import { RolePermissionsModal } from "./components/RolePermissionsModal";
import { ConfirmModal } from "@/components/Modal/ConfirmModal";
import { rolesService, RoleRequest, RoleResponse } from "@/core/services/roles.service";
import { SortingState, PaginationState } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

export default function RolesPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const queryClient = useQueryClient();

  const sortColumn = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  // Fetch Roles
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roles", globalFilter, sortColumn, sortOrder, pagination.pageIndex, pagination.pageSize],
    queryFn: () => rolesService.getAll({
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      searchTerm: globalFilter,
      sortColumn,
      sortOrder
    }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newRole: RoleRequest) => rolesService.create(newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsModalOpen(false);
      toast.success("Thêm mới nhóm quyền thành công!");
    },
    // Lỗi sẽ được catch ở RoleModal để hiển thị thông báo chi tiết
    onError: (error) => {
      toast.error(error.message || "Đã xảy ra lỗi khi lưu thông tin");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleRequest }) => rolesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsModalOpen(false);
      toast.success("Cập nhật nhóm quyền thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Đã xảy ra lỗi khi lưu thông tin");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => rolesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
      toast.success("Xóa nhóm quyền thành công!");
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa!"),
  });

  // Handlers
  const handleAdd = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: RoleResponse) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handlePermissions = (role: RoleResponse) => {
    setSelectedRole(role);
    setIsPermissionsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setRoleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete !== null) {
      deleteMutation.mutate(roleToDelete);
    }
  };

  const handleSave = async (roleData: RoleRequest, id?: number) => {
    if (id) {
      await updateMutation.mutateAsync({ id, data: roleData });
    } else {
      await createMutation.mutateAsync(roleData);
    }
  };

  const columns = useMemo(() => getColumns(handleEdit, handleDelete, handlePermissions), []);

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <RolesHeader onAdd={handleAdd} />

      {/* Danh sách Table */}
      <div className="flex-1 min-h-0 relative flex flex-col">
        <DataTable
          columns={columns}
          dataTable={data?.data || []}
          globalFilter={globalFilter}
          filterContent={
            <RolesSearch
              onSearch={(val) => {
                setGlobalFilter(val);
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                // setTimeout để đảm bảo state đã cập nhật trước khi gọi refetch
                setTimeout(() => refetch(), 0);
              }}
            />
          }
          sorting={sorting}
          onSortingChange={setSorting}
          manualSorting={true}
          pagination={pagination}
          onPaginationChange={setPagination}
          manualPagination={true}
          pageCount={data?.totalPages ?? -1}
        />
        <LoadingOverlay isLoading={isLoading} />
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedRole}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa nhóm quyền"
        message="Bạn có chắc chắn muốn xóa nhóm quyền này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
      />

      <RolePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        role={selectedRole}
      />
    </div>
  );
}
