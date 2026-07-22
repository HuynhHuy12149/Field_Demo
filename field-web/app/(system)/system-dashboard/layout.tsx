import { MainLayout } from "@/layouts/MainLayout/MainLayout";

export default function SystemDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout loginUrl="/system-login">{children}</MainLayout>;
}
