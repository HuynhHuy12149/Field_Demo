"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Tạo QueryClient instance duy nhất cho mỗi session của user
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Dữ liệu cũ sau 60s
            refetchOnWindowFocus: false, // Tắt tự động call API khi chuyển tab
            retry: 1, // Chỉ thử lại 1 lần nếu lỗi
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools giúp debug API cực mạnh, chỉ hiển thị ở chế độ dev */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
