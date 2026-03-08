"use client";

/**
 * AdminShell — shared sidebar + top bar layout for all admin pages.
 * Sidebar has grouped sections: CONTENT, COMMUNITY, SYSTEM.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui";
import { tokenStorage } from "@/services/auth.service";
import { routes } from "@/config";

export type ActivePage =
  | "dashboard"
  | "recipes"
  | "orders"
  | "users"
  | "contributions"
  | "feedback"
  | "settings";

interface NavItem {
  id: ActivePage;
  label: string;
  icon: string;
  href: string;
}

const NAV_STANDALONE: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "grid_view",
    href: routes.adminDashboard,
  },
];

const NAV_CONTENT: NavItem[] = [
  { id: "recipes", label: "Recipes", icon: "icecream", href: "/admin/recipes" },
  {
    id: "orders",
    label: "Orders",
    icon: "shopping_cart",
    href: "/admin/orders",
  },
];

const NAV_COMMUNITY: NavItem[] = [
  {
    id: "users",
    label: "User Management",
    icon: "manage_accounts",
    href: "/admin/users",
  },
  {
    id: "contributions",
    label: "Contributions",
    icon: "post_add",
    href: "/admin/contributions",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: "chat_bubble",
    href: "/admin/feedback",
  },
];

const NAV_SYSTEM: NavItem[] = [
  { id: "settings", label: "Settings", icon: "settings", href: "#" },
];

interface Props {
  children: React.ReactNode;
  activePage: ActivePage;
  pageTitle?: string;
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[14px] font-bold transition-all ${
        active
          ? "bg-primary text-white shadow-md shadow-primary/20"
          : "text-gray-500 hover:bg-white hover:text-text-main hover:shadow-sm"
      }`}
    >
      <MaterialIcon
        name={item.icon}
        filled={active}
        className={`text-[20px] shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-primary"}`}
      />
      {item.label}
    </Link>
  );
}

function NavGroup({
  label,
  items,
  activePage,
}: {
  label: string;
  items: NavItem[];
  activePage: ActivePage;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
        {label}
      </p>
      {items.map((item) => (
        <NavLink key={item.id} item={item} active={item.id === activePage} />
      ))}
    </div>
  );
}

export default function AdminShell({ children, activePage, pageTitle }: Props) {
  const router = useRouter();
  const user = tokenStorage.getUser();

  function handleLogout() {
    tokenStorage.clear();
    router.push(routes.adminLogin);
  }

  return (
    <div
      className="flex flex-1 overflow-hidden bg-[#f5f5f7]"
      style={{ fontFamily: "var(--font-display), Nunito, sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="flex w-[220px] shrink-0 flex-col justify-between border-r border-gray-100 bg-white py-5">
        <div className="flex flex-col gap-6 px-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow shadow-primary/30">
              <MaterialIcon
                name="icecream"
                filled
                className="text-[18px] text-white"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-black text-text-main">IScream</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                ADMIN
              </span>
            </div>
          </div>

          {/* Standalone */}
          <div className="flex flex-col gap-0.5">
            {NAV_STANDALONE.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={item.id === activePage}
              />
            ))}
          </div>

          {/* Grouped */}
          <NavGroup
            label="Content"
            items={NAV_CONTENT}
            activePage={activePage}
          />
          <NavGroup
            label="Community"
            items={NAV_COMMUNITY}
            activePage={activePage}
          />
          <NavGroup label="System" items={NAV_SYSTEM} activePage={activePage} />
        </div>

        {/* Bottom: user card + logout */}
        <div className="flex flex-col gap-1 px-4">
          <div className="mb-1 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-white">
              {(user?.fullName ?? user?.username ?? "A")[0].toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-xs font-bold text-text-main">
                {user?.fullName ?? user?.username ?? "Admin"}
              </span>
              <span className="truncate text-[10px] text-gray-400">
                {user?.email ?? "admin@mra-icecream..."}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold text-gray-500 transition-all hover:bg-red-50 hover:text-primary"
          >
            <MaterialIcon name="logout" className="text-[18px] text-gray-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white py-3 text-center text-xs text-gray-400">
          © 2024 IScream Ice Cream Parlor. Admin Dashboard.
        </footer>
      </div>
    </div>
  );
}
