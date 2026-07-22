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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Inbox } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  dataTable: TData[];
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
  dataTable,
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
    data: dataTable,
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
      <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/80 transition-colors group"
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            header.column.getIsSorted() === "asc" ? (
                              <ArrowUp size={14} className="text-primary" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown size={14} className="text-primary" />
                            ) : (
                              <ArrowUpDown size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-2.5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="px-6 py-10 h-[400px] align-middle text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-muted">
                        <Inbox size={48} strokeWidth={1.5} className="text-muted-foreground opacity-70" />
                      </div>
                      <p className="text-base">Không tìm thấy dữ liệu.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex-shrink-0 flex items-center justify-between border-t border-border bg-card px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[72px]">
                <SelectValue placeholder={`${table.getState().pagination.pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">mục / trang</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
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
                  variant={pageIndex === page ? "default" : "ghost"}
                  onClick={() => table.setPageIndex(page)}
                  className="h-8 w-8 p-0 text-sm font-medium"
                >
                  {page + 1}
                </Button>
              ));
            })()}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
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
