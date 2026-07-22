import React from "react";

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  className?: string;
}

export const ActionButton = ({ icon, tooltip, onClick, className = "" }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-lg focus:outline-none transition-colors ${className}`}
    >
      {icon}
    </button>
  );
};
