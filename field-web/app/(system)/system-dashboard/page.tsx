"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/Table/DataTable";
import { SystemDashboardHeader } from "./components/SystemDashboardHeader";
import { SystemDashboardSearch } from "./components/SystemDashboardSearch";
import { getColumns } from "./components/columns";
import { TenantModal } from "./components/TenantModal";
import { ConfirmModal } from "@/components/Modal/ConfirmModal";
import { ChangeTenantAdminPasswordModal } from "./components/ChangeTenantAdminPasswordModal";
import { systemTenantService, TenantResponse } from "@/core/services/system/system-tenant.service";
import { SortingState, PaginationState } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

export default function SystemDashboardPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<number | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedTenantIdForPassword, setSelectedTenantIdForPassword] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const queryClient = useQueryClient();

  // Fetch Tenants
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tenants", globalFilter, pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: () => systemTenantService.getAll({
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      searchTerm: globalFilter,
      sortColumn: sorting.length > 0 ? sorting[0].id : undefined,
      sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: systemTenantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setIsModalOpen(false);
      toast.success("Khởi tạo Schema và Khách hàng thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo!");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => systemTenantService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: systemTenantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setIsDeleteModalOpen(false);
      setTenantToDelete(null);
      toast.success("Xóa Khách hàng thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa!");
    },
  });

  // Handlers
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (id: number, status: number) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: number) => {
    setTenantToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (tenantToDelete !== null) {
      deleteMutation.mutate(tenantToDelete);
    }
  };

  const handleSave = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleChangePassword = (id: number) => {
    setSelectedTenantIdForPassword(id);
    setIsChangePasswordModalOpen(true);
  };

  const columns = useMemo(() => getColumns(handleUpdateStatus, handleDelete, handleChangePassword), []);

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <SystemDashboardHeader onAdd={handleAdd} />

      {/* Danh sách Table */}
      <div className="flex-1 min-h-0 relative flex flex-col">
        <DataTable
          columns={columns}
          dataTable={data?.data || []}
          globalFilter={globalFilter}
          filterContent={
            <SystemDashboardSearch
              onSearch={(val: string) => {
                setGlobalFilter(val);
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
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
        {isLoading && <LoadingOverlay isLoading={true} />}
      </div>

      <TenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isLoading={createMutation.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa khách hàng"
        message="Bạn có chắc chắn muốn xóa khách hàng này không? Việc này sẽ dẫn đến Schema Database bị vô hiệu hóa."
        confirmText="Xóa (Soft Delete)"
        isLoading={deleteMutation.isPending}
      />

      <ChangeTenantAdminPasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        tenantId={selectedTenantIdForPassword}
      />
    </div>
  );
}


 
