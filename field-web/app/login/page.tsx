"use client";
import { Field, Label, Input, Button } from '@headlessui/react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/core/services/auth.service";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [errorMsg, setErrorMsg] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async () => {
      return await authService.login({ email, password });
    },
    onSuccess: (data) => {
      // Lưu vào Zustand (được tự động mã hóa vào localStorage)
      setAuth(
        { id: "", email: data.email, fullName: data.fullName },
        data.token
      );
      setErrorMsg("");
      // Chuyển hướng vào trang trong (ví dụ /dashboard)
      router.push("/");
    },
    onError: (error: any) => {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    }
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4 relative overflow-hidden transition-colors duration-500">

      {/* Theme Toggle Button */}
      <ThemeToggle className="absolute top-4 right-4 z-50" />

      {/* Background decorations - Dark Mode */}
      <div className="hidden dark:block absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden dark:block absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Background decorations - Light Mode */}
      <div className="dark:hidden absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="dark:hidden absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="dark:hidden absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-slate-200/50 dark:border-white/20 p-8 sm:p-10 transition-all duration-300">

          {/* Logo or App Name */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">
              FieldService
            </h1>
            <p className="text-slate-500 dark:text-slate-300 mt-3 text-sm font-medium tracking-wide">
              Đăng nhập để quản lý dịch vụ
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Hiển thị lỗi nếu có */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Email Input */}
            <Field className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
                Email
              </Label>
              <div className="relative group">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-slate-900/70"
                  placeholder="admin@gmail.com"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
            </Field>

            {/* Password Input */}
            <Field className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Mật khẩu
                </Label>
                <a href="#" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative group">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-slate-900/70"
                  placeholder="••••••••"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
            </Field>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center py-4 px-6 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 data-[disabled]:opacity-70 data-[disabled]:cursor-not-allowed data-[disabled]:transform-none cursor-pointer"
            >
              {loginMutation.isPending ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loginMutation.isPending ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>

          </form>

        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
          Hệ thống Quản lý Dịch vụ Hiện trường
        </p>
      </div>
    </div>
  );
}
