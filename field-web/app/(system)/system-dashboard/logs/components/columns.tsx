"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SystemErrorLogResponse } from "@/core/services/system/system-logs.service";
import dayjs from "dayjs";
import { FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (
  onViewDetails: (stackTrace: string) => void
): ColumnDef<SystemErrorLogResponse>[] => [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-slate-600 dark:text-slate-400">
          {row.original.id}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-slate-700 dark:text-slate-300">
          {dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </div>
      ),
    },
    {
      accessorKey: "tenantSchema",
      header: "Schema",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-mono inline-block">
          {row.original.tenantSchema || "System"}
        </div>
      ),
    },
    {
      accessorKey: "errorMessage",
      header: "Nội dung lỗi",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-sm font-medium text-red-600 dark:text-red-400 truncate max-w-md">
          {row.original.errorMessage}
        </div>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem onClick={() => onViewDetails(row.original.stackTrace)} className="text-slate-700 focus:text-slate-900 cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];
