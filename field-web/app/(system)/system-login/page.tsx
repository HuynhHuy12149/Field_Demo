"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { systemAuthService } from "@/core/services/system/system-auth.service";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function SystemLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("systemAdminEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async () => {
      return await systemAuthService.login({ email, password });
    },
    onSuccess: (data) => {
      // Lưu vào Zustand (được tự động mã hóa vào localStorage)
      setAuth(
        { id: data.user.id.toString(), email: data.user.email, fullName: data.user.fullName, permissions: ["SystemAdmin"], type: "SuperAdmin" },
        data.token
      );
      toast.success("Đăng nhập Super Admin thành công!");
      // Chuyển hướng vào trang quản lý Khách hàng
      router.push("/system-dashboard");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    }
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }
    
    if (rememberMe) {
      localStorage.setItem("systemAdminEmail", email);
    } else {
      localStorage.removeItem("systemAdminEmail");
    }

    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-red-900 dark:to-slate-900 p-4 relative overflow-hidden transition-colors duration-500">

      {/* Theme Toggle Button */}
      <ThemeToggle className="absolute top-4 right-4 z-50" />

      {/* Background decorations - Dark Mode */}
      <div className="hidden dark:block absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden dark:block absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Background decorations - Light Mode */}
      <div className="dark:hidden absolute top-0 -left-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="dark:hidden absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(135,31,31,0.07)] dark:shadow-[0_8px_32px_0_rgba(135,31,31,0.37)] border border-slate-200/50 dark:border-white/20 p-8 sm:p-10 transition-all duration-300">

          {/* Logo or App Name */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 tracking-tight">
              System Admin
            </h1>
            <p className="text-slate-500 dark:text-slate-300 mt-3 text-sm font-medium tracking-wide">
              Đăng nhập quản trị hệ thống
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email Input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
                Email / Tên đăng nhập <span className="text-red-500">*</span>
              </Label>
              <div className="relative group">
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-slate-900/70"
                  placeholder="admin@system.com"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-slate-900/70"
                  placeholder="••••••••"
                  required
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center ml-1 mt-4 space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              />
              <label htmlFor="remember-me" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ghi nhớ tài khoản
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center py-2.5 px-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {loginMutation.isPending ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loginMutation.isPending ? "Đang xử lý..." : "Đăng Nhập"}
            </button>

          </form>

        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
          FieldService - Multi-Tenant Platform
        </p>
      </div>
    </div>
  );
}
