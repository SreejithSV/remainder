import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouterState, Link, Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ShieldCheck, LayoutDashboard, PlusCircle, Package, AlertTriangle, Users, BarChart3, Settings, X, Menu } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Toaster as Toaster$1 } from "sonner";
const appCss = "/assets/styles-CkgMsh5k.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/add-sale", label: "Add New Sale", icon: PlusCircle },
  { to: "/products", label: "All Products", icon: Package },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];
function AppLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex", children: [
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
        onClick: () => setOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto",
          open ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center gap-2 px-5 border-b border-white/10", children: [
            /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-lg tracking-tight", children: "WarrantyPro" })
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "p-3 space-y-1", children: nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: item.to,
                onClick: () => setOpen(false),
                className: cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active ? "bg-white text-primary shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"
                ),
                children: [
                  /* @__PURE__ */ jsx(Icon, { className: "h-4.5 w-4.5", size: 18 }),
                  item.label
                ]
              },
              item.to
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0 lg:ml-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "h-16 bg-card border-b flex items-center px-4 lg:px-6 sticky top-0 z-20", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setOpen((v) => !v),
            className: "lg:hidden p-2 -ml-2 rounded-md hover:bg-muted",
            "aria-label": "Toggle menu",
            children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "ml-2 lg:ml-0 font-semibold text-foreground", children: nav.find((n) => n.exact ? pathname === n.to : pathname.startsWith(n.to))?.label ?? "WarrantyPro" })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] }),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$7 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AppLayout, {}) });
}
const $$splitComponentImporter$6 = () => import("./settings-BEJofLw2.mjs");
const Route$6 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./reports-DurQVXTV.mjs");
const Route$5 = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./products-BfKfv4lB.mjs");
const Route$4 = createFileRoute("/products")({
  head: () => ({
    meta: [{
      title: "All Products — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./customers-Qs6QgV6J.mjs");
const Route$3 = createFileRoute("/customers")({
  head: () => ({
    meta: [{
      title: "Customers — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./alerts-B_iGkQxp.mjs");
const Route$2 = createFileRoute("/alerts")({
  head: () => ({
    meta: [{
      title: "Warranty Alerts — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./add-sale-DVgmX4pN.mjs");
const Route$1 = createFileRoute("/add-sale")({
  head: () => ({
    meta: [{
      title: "Add New Sale — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CZSqD7Wy.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Dashboard — WarrantyPro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SettingsRoute = Route$6.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$7
});
const ReportsRoute = Route$5.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$7
});
const ProductsRoute = Route$4.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => Route$7
});
const CustomersRoute = Route$3.update({
  id: "/customers",
  path: "/customers",
  getParentRoute: () => Route$7
});
const AlertsRoute = Route$2.update({
  id: "/alerts",
  path: "/alerts",
  getParentRoute: () => Route$7
});
const AddSaleRoute = Route$1.update({
  id: "/add-sale",
  path: "/add-sale",
  getParentRoute: () => Route$7
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  AddSaleRoute,
  AlertsRoute,
  CustomersRoute,
  ProductsRoute,
  ReportsRoute,
  SettingsRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  cn as c,
  router as r
};
