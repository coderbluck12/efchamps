"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brand, Button, Icon, type IconName } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { api } from "../lib/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getAdminOverview()
      .then(setStats)
      .catch(() => {});
  }, [pathname]);

  const navigation: { label: string; href: string; icon: IconName; badge?: string }[] = [
    { label: "Overview", href: "/admin", icon: "grid" },
    { label: "Players", href: "/admin/players", icon: "shield", badge: stats?.totalPlayers ? stats.totalPlayers.toString() : undefined },
    { label: "Matches", href: "/admin/matches", icon: "controller", badge: stats?.liveMatches ? stats.liveMatches.toString() : undefined },
    { label: "Disputes", href: "/admin/disputes", icon: "headset", badge: stats?.openDisputes ? stats.openDisputes.toString() : undefined },
    { label: "Transactions", href: "/admin/transactions", icon: "wallet" },
    { label: "Tournaments", href: "/admin/tournaments", icon: "crown", badge: stats?.tournamentsCount ? stats.tournamentsCount.toString() : undefined },
    { label: "Settings", href: "/admin/settings", icon: "stake" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-[250px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#282b31] bg-[#0f1114] px-5 py-6 lg:min-h-screen">
        <div className="px-3">
          <Link href="/">
            <Brand />
          </Link>
          <div className="mt-4 w-fit rounded border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-1 text-[7px] font-black uppercase tracking-[0.14em] text-[#f59e0b]">
            Admin access
          </div>
        </div>
        <p className="mb-3 mt-8 lg:mt-9 px-3 text-[8px] font-black uppercase tracking-[0.17em] text-[#4f545e]">Operations</p>
        <nav className="space-y-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-left text-[10px] font-bold whitespace-nowrap transition ${
                  isActive ? "bg-[#00FF66]/10 text-[#00FF66]" : "text-[#858a95] hover:bg-white/[0.04] hover:text-white"
                }`}
                key={item.label}
              >
                <Icon name={item.icon} size={16} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`rounded px-1.5 py-0.5 text-[8px] ${isActive ? "bg-[#00FF66] text-[#07140c]" : "bg-[#26292e] text-[#7e838d]"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden lg:block rounded-lg border border-[#332f25] bg-[#17150f] p-4">
          <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#f59e0b]">Audit mode enabled</p>
          <p className="mt-2 text-[9px] leading-4 text-[#797363]">Every administrative action is connected directly to your active database session.</p>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-[#25282d] px-2 pt-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-[9px] font-black">
            {user?.username?.substring(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate">{user?.username || "Administrator"}</p>
            <p className="mt-0.5 text-[8px] text-[#626772]">Database Admin</p>
          </div>
          <span className="size-2 rounded-full bg-[#00FF66]" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-18 items-center justify-between border-b border-[#282b31] bg-[#0e0f12] px-6 lg:px-8">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#5f646e]">efChamps operations</p>
            <p className="mt-1 text-xs font-bold text-white">Live Database Connected <span className="ml-2 text-[#00FF66]">• Healthy</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="secondary" className="h-9 px-3 text-[10px]">
                Exit to User Dashboard
              </Button>
            </Link>
            <div className="rounded-lg border border-[#2b2e34] bg-[#15171b] px-4 py-2">
              <p className="text-[8px] uppercase tracking-[0.12em] text-[#5f646e]">Total Gross Volume</p>
              <p className="mt-1 text-xs font-black text-white">
                ₦{Number(stats?.grossVolume || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* View Body */}
        <main className="flex-1 px-6 lg:px-8 py-7 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
