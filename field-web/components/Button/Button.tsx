import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantMap = {
    primary: "default",
    secondary: "secondary",
    danger: "destructive",
    ghost: "ghost",
  } as const;

  const sizeMap = {
    sm: "sm",
    md: "default",
    lg: "lg",
  } as const;

  return (
    <ShadcnButton
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={className}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </ShadcnButton>
  );
}
