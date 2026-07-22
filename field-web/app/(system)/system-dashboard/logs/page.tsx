"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { systemLogsService } from "@/core/services/system/system-logs.service";
import { systemTenantService } from "@/core/services/system/system-tenant.service";
import { DataTable } from "@/components/Table/DataTable";
import { getColumns } from "./components/columns";
import { LogDetailModal } from "./components/LogDetailModal";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

import { SearchButton } from "@/components/Button/SearchButton";

export default function SystemLogsPage() {
  const [selectedSchema, setSelectedSchema] = useState<string>("all");
  const [tenantSchema, setTenantSchema] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [selectedStackTrace, setSelectedStackTrace] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Tenants for the filter dropdown
  const { data: tenantsData } = useQuery({
    queryKey: ["system-tenants-filter"],
    queryFn: () => systemTenantService.getAll({ page: 1, pageSize: 100 }),
  });

  // Fetch Logs
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["system-logs", pagination.pageIndex, pagination.pageSize, tenantSchema, sorting],
    queryFn: () => systemLogsService.getLogs(
      pagination.pageIndex + 1, 
      pagination.pageSize, 
      tenantSchema === "all" ? undefined : tenantSchema, 
      sorting.length > 0 ? sorting[0].id : undefined,
      sorting.length > 0 ? sorting[0].desc : true
    ),
  });

  const handleViewDetails = (stackTrace: string) => {
    setSelectedStackTrace(stackTrace);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setTenantSchema(selectedSchema);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const headerContent = (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-white/10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          Nhật ký lỗi hệ thống
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Xem và lọc các lỗi hệ thống từ các Tenant
        </p>
      </div>
    </div>
  );

  const filterContent = (
    <div className="flex flex-1 sm:flex-none items-center gap-2">
      <div className="w-[320px]">
        <Select 
          value={selectedSchema} 
          onValueChange={(val) => setSelectedSchema(val)}
        >
          <SelectTrigger className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-inset focus:ring-blue-500">
            <SelectValue placeholder="Tất cả Tenant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Tenant</SelectItem>
            {tenantsData?.data?.map((t) => (
              <SelectItem key={t.schemaName} value={t.schemaName}>
                {t.name} ({t.schemaName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SearchButton onClick={handleSearch} />
    </div>
  );

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      {headerContent}

      <div className="flex-1 min-h-0 relative flex flex-col">
        <DataTable
          columns={getColumns(handleViewDetails)}
          dataTable={logsData?.items || []}
          filterContent={filterContent}
          sorting={sorting}
          onSortingChange={setSorting}
          manualSorting={true}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={logsData?.totalPages || 0}
          manualPagination={true}
        />
      </div>

      <LogDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stackTrace={selectedStackTrace}
      />
    </div>
  );
}
