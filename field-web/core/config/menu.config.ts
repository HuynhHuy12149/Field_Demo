import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Shield,
  UserCog,
  Key
} from "lucide-react";

export type MenuItem = {
  name: string;
  path?: string; // Tùy chọn nếu có menu con thì thằng cha không cần path
  icon?: any;
  permission?: string; // Tên quyền hạn (ví dụ: VIEW_DASHBOARD)
  subItems?: MenuItem[]; // Menu con
};

export const MENU_CONFIG: MenuItem[] = [
  {
    name: "Tổng quan",
    path: "/",
    icon: LayoutDashboard,
    // permission: "VIEW_DASHBOARD" // Dashboard thì ai cũng xem được nên không cần
  },
  {
    name: "Hệ thống",
    icon: Settings,
    // permission: "VIEW_SYSTEM", // Chỉ cần check permission của menu con là đủ
    subItems: [
      {
        name: "Người dùng",
        path: "/system/users",
        icon: UserCog,
        permission: "Users.View"
      },
      {
        name: "Nhóm quyền",
        path: "/system/roles",
        icon: Shield,
        permission: "Roles.View"
      }
    ]
  },
];
