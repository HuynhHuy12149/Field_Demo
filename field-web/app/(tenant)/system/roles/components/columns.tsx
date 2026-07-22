"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Key, Shield } from "lucide-react";
import { RoleResponse } from "@/core/services/tenant/roles.service";

export const getColumns = (
  onEdit: (role: RoleResponse) => void,
  onDelete: (id: number) => void,
  onPermissions: (role: RoleResponse) => void
): ColumnDef<RoleResponse>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <span className="text-slate-600 dark:text-slate-400">
          {pageIndex * pageSize + row.index + 1}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên nhóm quyền",
    cell: (info) => (
      <div 
        className="font-medium text-slate-800 dark:text-slate-200 max-w-[150px] md:max-w-[250px] truncate"
        title={info.getValue() as string}
      >
        {info.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: (info) => {
      const desc = info.getValue() as string;
      return (
        <div 
          className="max-w-[200px] md:max-w-[350px] lg:max-w-[500px] truncate text-slate-500" 
          title={desc}
        >
          {desc || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: (info) => {
      const isActive = info.getValue() as boolean;
      return isActive ? (
        <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
          Hoạt động
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
          Ngừng hoạt động
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer">
            <MoreHorizontal size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <DropdownMenuItem onClick={() => onEdit(role)} className="cursor-pointer">
              <Edit className="mr-3 h-4 w-4 text-slate-400" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPermissions(role)} className="cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-900/20">
              <Shield className="mr-3 h-4 w-4 text-blue-500" />
              <span>Phân quyền</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
            <DropdownMenuItem onClick={() => onDelete(role.id)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
              <Trash className="mr-3 h-4 w-4 text-red-500" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
