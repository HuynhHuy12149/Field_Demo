"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/Table/DataTable";
import { UsersHeader } from "./components/UsersHeader";
import { UsersSearch } from "./components/UsersSearch";
import { getColumns } from "./components/columns";
import { UserModal } from "./components/UserModal";
import { ConfirmModal } from "@/components/Modal/ConfirmModal";
import { usersService, UserResponse } from "@/core/services/tenant/users.service";
import { SortingState, PaginationState } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

export default function UsersPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const queryClient = useQueryClient();

  const sortColumn = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  // Fetch Users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", globalFilter, sortColumn, sortOrder, pagination.pageIndex, pagination.pageSize],
    queryFn: () => usersService.getAll({
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      searchTerm: globalFilter,
      sortColumn,
      sortOrder
    }),
  });
  // Mutations
  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      toast.success("Thêm mới thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm mới!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      toast.success("Cập nhật thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      toast.success("Xóa thành công!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa!");
    },
  });

  // Handlers
  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete !== null) {
      deleteMutation.mutate(userToDelete);
    }
  };

  const handleSave = async (data: any, id?: number) => {
    if (id) {
      await updateMutation.mutateAsync({ id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const columns = useMemo(() => getColumns(handleEdit, handleDelete), []);

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <UsersHeader onAdd={handleAdd} />

      {/* Danh sách Table */}
      <div className="flex-1 min-h-0 relative flex flex-col">
        <DataTable
          columns={columns}
          dataTable={data?.data || []}
          globalFilter={globalFilter}
          filterContent={
            <UsersSearch
              onSearch={(val) => {
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
        <LoadingOverlay isLoading={isLoading} />
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedUser}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
