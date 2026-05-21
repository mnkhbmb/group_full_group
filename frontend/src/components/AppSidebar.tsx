import { LayoutDashboard, Building2, Receipt, Wrench, Users, User, Settings, LogOut, ChevronUp, UserCog } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth, ROLE_LABELS } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { canAccessRoute, type RouteKey } from "@/lib/permissions";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems: { title: string; url: string; icon: typeof LayoutDashboard; key: RouteKey }[] = [
  { title: "Хяналтын самбар", url: "/",            icon: LayoutDashboard, key: "dashboard" },
  { title: "Хөрөнгө",         url: "/property",    icon: Building2,       key: "property" },
  { title: "Түрээслэгч",      url: "/tenants",     icon: Users,           key: "tenants" },
  { title: "Санхүү бүртгэл",  url: "/finance",     icon: Receipt,         key: "finance" },
  { title: "Ашиглалт",        url: "/operations",  icon: Wrench,          key: "operations" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="font-bold text-base text-sidebar-foreground">
              Хөрөнгийн Менежмент
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Үндсэн цэс</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.filter((item) => canAccessRoute(user?.role, item.key)).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
                    <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin — хэрэглэгч удирдлага */}
        {canAccessRoute(user?.role, "users") && (
          <SidebarGroup>
            <SidebarGroupLabel>Админ</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/users"} tooltip="Хэрэглэгчид">
                    <NavLink to="/users" end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <UserCog className="h-4 w-4" />
                      {!collapsed && <span>Хэрэглэгчид</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <div className="text-left">
                        <p className="text-sm font-medium leading-none">{user?.name || "Хэрэглэгч"}</p>
                        <p className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ""}</p>
                      </div>
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Профайл
                </DropdownMenuItem>
                {canAccessRoute(user?.role, "users") && (
                  <DropdownMenuItem onClick={() => navigate("/users")}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Хэрэглэгчид
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Гарах
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
