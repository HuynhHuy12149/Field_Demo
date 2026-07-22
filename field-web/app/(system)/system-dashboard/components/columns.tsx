"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TenantResponse } from "@/core/services/system/system-tenant.service";
import { ActionButton } from "@/components/Button/ActionButton";
import { StatusBadge } from "@/components/Badge/StatusBadge";
import dayjs from "dayjs";
import { Lock, Unlock, Trash2, MoreHorizontal, KeyRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/core/utils/formatTime";

export const getColumns = (
  onUpdateStatus: (id: number, status: number) => void,
  onDelete: (id: number) => void,
  onChangePassword: (id: number) => void
): ColumnDef<TenantResponse>[] => [
    {
      accessorKey: "name",
      header: "Tên Khách hàng",
      cell: ({ row }) => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "adminEmail",
      header: "Email Admin",
      cell: ({ row }) => (
        <div className="text-slate-600 dark:text-slate-400">
          {row.original.adminEmail}
        </div>
      ),
    },
    {
      accessorKey: "schemaName",
      header: "Database Schema",
      cell: ({ row }) => (
        <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-mono inline-block">
          {row.original.schemaName}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Phân loại",
      cell: ({ row }) => {
        const type = row.original.type;
        const typeText = type === 1 ? "Field" : type === 2 ? "Class" : "ERP";
        const typeColor = type === 1 ? "bg-blue-100 text-blue-700" : type === 2 ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
            {typeText}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <StatusBadge isActive={row.original.status === 1} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <div className="text-slate-500 dark:text-slate-400 text-sm">
          <div className="font-medium text-slate-700 dark:text-slate-300">
            {dayjs(row.original.createdAt).format("DD/MM/YYYY")}
          </div>
          <div className="text-xs">
            {formatRelativeTime(row.original.createdAt)}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => {
        const tenant = row.original;
        const isActive = tenant.status === 1;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={"w-auto"}>
              {isActive ? (
                <DropdownMenuItem onClick={() => onUpdateStatus(tenant.id, 2)} className="text-orange-600 focus:text-orange-600">
                  <Lock className="w-4 h-4 mr-2" />
                  Khóa
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onUpdateStatus(tenant.id, 1)} className="text-emerald-600 focus:text-emerald-600">
                  <Unlock className="w-4 h-4 mr-2" />
                  Mở khóa
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onChangePassword(tenant.id)} className="text-blue-600 focus:text-blue-600">
                <KeyRound className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(tenant.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];


