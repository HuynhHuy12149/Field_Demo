"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { UserResponse } from "@/core/services/users.service";

export const getColumns = (
  onEdit: (user: UserResponse) => void,
  onDelete: (id: number) => void
): ColumnDef<UserResponse>[] => [
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
    accessorKey: "fullName",
    header: "Họ tên",
    cell: (info) => (
      <div 
        className="font-medium text-slate-800 dark:text-slate-200 max-w-[150px] md:max-w-[200px] truncate"
        title={info.getValue() as string}
      >
        {info.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => {
      const email = info.getValue() as string;
      return (
        <div 
          className="max-w-[150px] md:max-w-[250px] truncate text-slate-500"
          title={email}
        >
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: (info) => info.getValue() || "-",
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
          Khóa
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors">
              <MoreHorizontal size={18} />
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <button
                  onClick={() => onEdit(user)}
                  className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 data-[focus]:bg-slate-100 dark:data-[focus]:bg-slate-700 data-[focus]:text-slate-900 dark:data-[focus]:text-white"
                >
                  <Edit className="mr-3 h-4 w-4 text-slate-400 group-data-[focus]:text-slate-500" />
                  Chỉnh sửa
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => onDelete(user.id)}
                  className="group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-500/10"
                >
                  <Trash className="mr-3 h-4 w-4 text-red-500 group-data-[focus]:text-red-600" />
                  Xóa
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      );
    },
  },
];
