"use client";

import { useState, ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { Button, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Inbox, ChevronDown, Check } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  globalFilter?: string;
  filterContent?: ReactNode;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  manualSorting?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  pageCount?: number;
  manualPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilter = "",
  filterContent,
  sorting,
  onSortingChange,
  manualSorting = false,
  pagination,
  onPaginationChange,
  pageCount,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalPagination, setInternalPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const currentSorting = sorting !== undefined ? sorting : internalSorting;
  const handleSortingChange = onSortingChange || setInternalSorting;

  const currentPagination = pagination !== undefined ? pagination : internalPagination;
  const handlePaginationChange = onPaginationChange || setInternalPagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting,
    manualPagination,
    pageCount,
    state: {
      sorting: currentSorting,
      globalFilter,
      pagination: currentPagination,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
  });

  return (
    <div className="flex flex-col h-full min-h-0 space-y-4">
      {/* Filter Slot */}
      {filterContent && (
        <div className="flex-shrink-0">
          {filterContent}
        </div>
      )}

      {/* Table Area (Fills remaining height) */}
      <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 relative">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-semibold text-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown size={14} className="text-slate-400" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 h-[400px] align-middle text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50">
                        <Inbox size={48} strokeWidth={1.5} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-base">Không tìm thấy dữ liệu.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Hiển thị</span>
            <Listbox value={table.getState().pagination.pageSize} onChange={val => table.setPageSize(val)}>
              <div className="relative w-[72px]">
                <ListboxButton className="relative w-full cursor-pointer rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-3 pr-8 text-left text-sm font-medium text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="block truncate">{table.getState().pagination.pageSize}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-50 bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg border border-slate-200 dark:border-slate-700 focus:outline-none sm:text-sm">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <ListboxOption
                      key={pageSize}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-8 pr-4 ${
                          active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                        }`
                      }
                      value={pageSize}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {pageSize}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-blue-600 dark:text-blue-400">
                              <Check size={14} aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
            <span className="text-sm text-slate-500 dark:text-slate-400">mục / trang</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 data-[disabled]:opacity-50 transition-colors cursor-pointer data-[disabled]:cursor-default"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={18} />
            </Button>
            
            {(() => {
              const pageCount = table.getPageCount();
              if (pageCount === 0) return null;
              
              const pageIndex = table.getState().pagination.pageIndex;
              let pages = [];
              if (pageCount <= 5) {
                pages = Array.from({ length: pageCount }, (_, i) => i);
              } else {
                if (pageIndex <= 2) pages = [0, 1, 2, 3, 4];
                else if (pageIndex >= pageCount - 3) pages = [pageCount - 5, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1];
                else pages = [pageIndex - 2, pageIndex - 1, pageIndex, pageIndex + 1, pageIndex + 2];
              }

              return pages.map(page => (
                <Button
                  key={page}
                  onClick={() => table.setPageIndex(page)}
                  className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    pageIndex === page
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {page + 1}
                </Button>
              ));
            })()}

            <Button
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 data-[disabled]:opacity-50 transition-colors cursor-pointer data-[disabled]:cursor-default"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
