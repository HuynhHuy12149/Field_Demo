import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = "Đang xử lý..."
}) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg transition-all duration-300">
      <div className="relative flex justify-center items-center">
        {/* Vòng quay bên ngoài */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
        {/* Vòng quay chạy màu */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
      {text && (
        <span className="mt-10 text-sm font-medium text-slate-700 dark:text-slate-300 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};
