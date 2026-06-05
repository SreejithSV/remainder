import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  AlertTriangle,
  Users,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "../components/ui/sonner";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/add-sale", label: "Add New Sale", icon: PlusCircle },
  { to: "/products", label: "All Products", icon: Package },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">WarrantyPro</span>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as string}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4.5 w-4.5" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="h-16 bg-card border-b flex items-center px-4 lg:px-6 sticky top-0 z-20">
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="ml-2 lg:ml-0 font-semibold text-foreground">
            {nav.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to)))?.label ??
              "WarrantyPro"}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}