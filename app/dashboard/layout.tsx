"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand, Button, Icon } from "../components/ui";
import { useAuth } from "../lib/auth-context";
import { api } from "../lib/api";
import { ActionModal } from "./dashboard-components"; // We'll export ActionModal too

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, refreshUser } = useAuth();
  const pathname = usePathname();
  const [modal, setModal] = useState<"funds" | "withdraw" | "challenge" | null>(null);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [counts, setCounts] = useState<{
    openMatches: number;
    activeStakes: number;
    openTournaments: number;
  }>({
    openMatches: 0,
    activeStakes: 0,
    openTournaments: 0,
  });

  useEffect(() => {
    if (!modal) refreshUser();
  }, [modal]);

  useEffect(() => {
    if (!user) return;
    const fetchRealData = () => {
      // 1. Check active match for banner & stakes count
      api.getMyActiveMatches()
        .then((matches: any[]) => {
          const list = Array.isArray(matches) ? matches : [];
          if (list.length > 0) {
            setActiveMatch(list[0]);
          } else {
            setActiveMatch(null);
          }
          setCounts((prev) => ({ ...prev, activeStakes: list.length }));
        })
        .catch(() => {});

      // 2. Fetch real open matches count in lobby
      api.getOpenMatches()
        .then((open: any[]) => {
          const count = Array.isArray(open) ? open.length : 0;
          setCounts((prev) => ({ ...prev, openMatches: count }));
        })
        .catch(() => {});

      // 3. Fetch real tournaments count
      api.getTournaments()
        .then((tList: any[]) => {
          const list = Array.isArray(tList) ? tList : [];
          const openTournaments = list.filter((t: any) => t.status === "OPEN").length;
          setCounts((prev) => ({ ...prev, openTournaments: openTournaments || list.length }));
        })
        .catch(() => {});
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 4000);
    return () => clearInterval(interval);
  }, [user, pathname]);

  const sidebar = [
    { icon: "grid", label: "Match Lobby", href: "/dashboard", badge: counts.openMatches > 0 ? String(counts.openMatches) : undefined },
    { icon: "stake", label: "My Active Stakes", href: "/dashboard/stakes", badge: counts.activeStakes > 0 ? String(counts.activeStakes) : undefined },
    { icon: "crown", label: "Tournaments", href: "/dashboard/tournaments", badge: counts.openTournaments > 0 ? String(counts.openTournaments) : undefined },
    { icon: "wallet", label: "Secure Wallet", href: "/dashboard/wallet" },
    { icon: "leaderboard", label: "Leaderboard", href: "/dashboard/leaderboard" },
    { icon: "headset", label: "Support", href: "/dashboard/support" },
  ];

  return (
    <div className="relative min-h-screen max-w-[100vw] overflow-x-hidden bg-[#0C0D10] text-white flex flex-col lg:flex-row pb-16 lg:pb-0">
      {/* Desktop Sidebar (Hidden on mobile/tablet) */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-[#282b31] bg-[#101115] px-5 py-6 min-h-screen">
        <div className="px-3">
          <Link href="/">
            <Brand />
          </Link>
        </div>
        <div className="mt-12 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#4f545e]">Competition</div>
        <nav className="mt-3 space-y-1.5 flex flex-col">
          {sidebar.map((item) => (
            <Link
              href={item.href}
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition ${
                pathname === item.href ? "bg-[#00FF66]/10 text-[#00FF66]" : "text-[#858a95] hover:bg-white/5 hover:text-white"
              }`}
              key={item.label}
            >
              <Icon name={item.icon as any} size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] ${pathname === item.href ? "bg-[#00FF66] text-[#07140c]" : "bg-[#272a30] text-[#9196a0]"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-[#29302c] bg-gradient-to-br from-[#18221b] to-[#121512] p-4">
          <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-[#00FF66]/10 text-[#00FF66]">
            <Icon name="shield" size={17} />
          </div>
          <p className="text-xs font-bold text-white">Stay in control</p>
          <p className="mt-1.5 text-[10px] leading-4 text-[#737a76]">Set limits and play responsibly.</p>
          <Link href="/dashboard/wallet" className="mt-3 block text-[10px] font-bold text-[#00FF66]">
            View controls →
          </Link>
        </div>
        <div className="mt-5 border-t border-[#25282e] pt-4 flex items-center justify-between gap-2">
          <Link href="/dashboard/profile" className="flex items-center gap-3 min-w-0 flex-1 px-1 text-left hover:opacity-85 transition">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-[10px] font-black text-white shrink-0">
              {user?.username?.substring(0, 2).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user?.username}</p>
              <p className="text-[9px] text-[#626771]">Verified player</p>
            </div>
          </Link>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) {
                logout();
              }
            }}
            title="Log out"
            type="button"
            className="flex size-8 items-center justify-center rounded-lg border border-[#30343a] text-[#777c86] hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <Icon name="logout" size={15} />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-w-0 flex-1 flex flex-col max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 sm:h-19 items-center justify-between border-b border-[#282b31] bg-[#0e0f12] px-3 sm:px-6 lg:px-8 max-w-full">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="lg:hidden shrink-0">
              <Link href="/">
                <Brand compact={false} />
              </Link>
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5f646e]">Welcome back</p>
              <h2 className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-none">
                {user?.username} <span className="ml-1 text-[#00FF66]">• Online</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Balance Badge */}
            <div className="flex h-9 sm:h-11 items-center rounded-lg border border-[#292c32] bg-[#15171b] pl-2 sm:pl-4">
              <div className="pr-1.5 sm:pr-3">
                <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.12em] text-[#5e636d]">Balance</p>
                <p className="text-[10px] sm:text-xs font-bold text-white">
                  ₦{parseFloat((user?.wallet?.availableBalance as any) || "0").toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <button
                className="flex h-full w-7 sm:w-10 items-center justify-center rounded-r-lg border-l border-[#292c32] text-[#00FF66] transition hover:bg-[#00FF66]/10"
                onClick={() => setModal("funds")}
                title="Add funds"
                type="button"
              >
                <Icon name="plus" size={14} />
              </button>
            </div>

            {/* Create Challenge Button */}
            <Button className="h-9 sm:h-11 px-2.5 sm:px-5 text-[11px] sm:text-xs" onClick={() => setModal("challenge")}>
              <Icon name="plus" size={14} /> <span className="hidden sm:inline">Create Challenge</span><span className="sm:hidden font-bold">Play</span>
            </Button>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (confirm("Are you sure you want to log out?")) {
                  logout();
                }
              }}
              className="flex h-9 sm:h-11 items-center justify-center rounded-lg border border-[#30343a] bg-[#14161a] px-2 sm:px-3 text-xs font-semibold text-[#8b909a] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition"
              title="Log out of account"
              type="button"
            >
              <Icon name="logout" size={14} />
              <span className="hidden md:inline ml-1.5">Logout</span>
            </button>
          </div>
        </header>

        {/* Live Active Match Notification Banner */}
        {activeMatch && (
          <div className="flex items-center justify-between border-b border-[#00FF66]/30 bg-[#00FF66]/10 px-6 lg:px-8 py-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF66] opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-[#00FF66]"></span>
              </span>
              <p className="font-bold text-white">
                🎮 {activeMatch.creator?.id === user?.id && activeMatch.opponent
                  ? `Player "${activeMatch.opponent.username}" has joined your challenge!`
                  : `You have an active 1v1 match in progress with ${activeMatch.creator?.id === user?.id ? activeMatch.opponent?.username : activeMatch.creator?.username}!`}
              </p>
            </div>
            <Link href={`/match/${activeMatch.id}`}>
              <Button className="h-8 px-4 text-[10px]">
                Enter Match Room →
              </Button>
            </Link>
          </div>
        )}

        {/* View Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (App-like feel) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#282b31] bg-[#101115]/95 backdrop-blur-md px-2 lg:hidden">
        {sidebar.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 min-w-[56px] text-[10px] font-bold transition ${
                isActive ? "text-[#00FF66]" : "text-[#7b808c] hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon name={item.icon as any} size={20} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 flex size-3.5 items-center justify-center rounded-full bg-[#00FF66] text-[7px] font-black text-black">
                    {item.badge.includes("/") ? item.badge.split("/")[0] : item.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[58px]">
                {item.label === "Match Lobby" ? "Lobby" : item.label === "My Active Stakes" ? "Stakes" : item.label === "Secure Wallet" ? "Wallet" : item.label}
              </span>
            </Link>
          );
        })}
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 min-w-[56px] text-[10px] font-bold transition ${
            pathname === "/dashboard/profile" ? "text-[#00FF66]" : "text-[#7b808c] hover:text-white"
          }`}
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-[8px] font-black text-white">
            {user?.username?.substring(0, 2).toUpperCase() || "U"}
          </div>
          <span className="truncate max-w-[58px]">Profile</span>
        </Link>
      </nav>

      {modal && <ActionModal onClose={() => setModal(null)} type={modal} />}
    </div>
  );
}
