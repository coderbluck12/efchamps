"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import { Brand, Button, Icon, type IconName } from "../components/ui";

export type AdminView =
  | "Overview"
  | "Players"
  | "Matches"
  | "Disputes"
  | "Transactions"
  | "Tournaments"
  | "Risk & Limits"
  | "Settings";

const adminRows: Record<Exclude<AdminView, "Overview" | "Settings">, { headers: string[]; rows: string[][] }> = {
  Players: {
    headers: ["Player", "Status", "Platform", "Matches", "Wallet", "Action"],
    rows: [
      ["RicoNXT", "Verified", "PS5", "148", "$184.50", "Review"],
      ["KairoFC", "Verified", "Xbox", "221", "$92.00", "Review"],
      ["DrePrime", "KYC pending", "Mobile", "34", "$45.00", "Verify"],
      ["VantaXI", "Under review", "PS5", "96", "$0.00", "Inspect"],
      ["GoalGhost", "Verified", "PC", "302", "$416.20", "Review"],
    ],
  },
  Matches: {
    headers: ["Match ID", "Players", "Platform", "Stake", "State", "Action"],
    rows: [
      ["#MT-8842", "RicoNXT vs KairoFC", "Cross-play", "$25.00", "Live • 42'", "Monitor"],
      ["#MT-8841", "GoalGhost vs VantaXI", "PS5", "$50.00", "Result pending", "Inspect"],
      ["#MT-8839", "AxelPro vs DrePrime", "Xbox", "$10.00", "Completed", "Details"],
      ["#MT-8837", "NeoStriker vs Osei10", "Mobile", "$5.00", "Evidence review", "Inspect"],
      ["#MT-8834", "Mendoza10 vs KairoFC", "PC", "$100.00", "Completed", "Details"],
    ],
  },
  Disputes: {
    headers: ["Case", "Match", "Reason", "Exposure", "SLA", "Action"],
    rows: [
      ["#DSP-2048", "GoalGhost vs VantaXI", "Conflicting scores", "$100.00", "08 min", "Resolve"],
      ["#DSP-2047", "NeoStriker vs Osei10", "Disconnection", "$10.00", "21 min", "Resolve"],
      ["#DSP-2044", "KairoFC vs AxelPro", "Missing evidence", "$50.00", "44 min", "Review"],
      ["#DSP-2041", "Mavrick_J vs RicoNXT", "Rule violation", "$30.00", "1h 12m", "Review"],
    ],
  },
  Transactions: {
    headers: ["Transaction", "Player", "Type", "Amount", "Status", "Action"],
    rows: [
      ["#TX-90421", "GoalGhost", "Prize release", "+$90.00", "Settled", "Receipt"],
      ["#TX-90420", "KairoFC", "Stake lock", "−$25.00", "Escrow", "Inspect"],
      ["#TX-90419", "DrePrime", "Deposit", "+$50.00", "Settled", "Receipt"],
      ["#TX-90418", "VantaXI", "Withdrawal", "−$120.00", "Review", "Approve"],
      ["#TX-90417", "RicoNXT", "Stake refund", "+$10.00", "Settled", "Receipt"],
    ],
  },
  Tournaments: {
    headers: ["Tournament", "Host", "Players", "Escrow", "State", "Action"],
    rows: [
      ["Knockout #108", "Player_Alpha", "5 / 8", "$80.00", "Filling", "Manage"],
      ["Weekend Cup #42", "GoalVault", "32 / 32", "$640.00", "Round 2", "Manage"],
      ["Mobile Kings #19", "DrePrime", "16 / 16", "$160.00", "Semi-final", "Manage"],
      ["High Roller #07", "Mendoza10", "7 / 8", "$800.00", "Filling", "Review"],
    ],
  },
  "Risk & Limits": {
    headers: ["Signal", "Player", "Risk Level", "Exposure", "Detected", "Action"],
    rows: [
      ["Velocity anomaly", "VantaXI", "High", "$240.00", "2 min ago", "Freeze"],
      ["Shared device", "NeoStriker", "Medium", "$65.00", "14 min ago", "Inspect"],
      ["Repeated disconnect", "Osei10", "Medium", "$30.00", "26 min ago", "Limit"],
      ["Deposit pattern", "AxelPro", "Low", "$110.00", "1h ago", "Review"],
    ],
  },
};

function ViewHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00FF66]">{eyebrow}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.035em] text-white">{title}</h1>
        <p className="mt-2 text-xs text-[#737883]">{copy}</p>
      </div>
      {action}
    </div>
  );
}


function AdminTableView({ view }: { view: Exclude<AdminView, "Overview" | "Settings"> }) {
  const dataDef = adminRows[view];
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (view === "Players") {
      api.getAdminPlayers().then(r => setRows(r.map((p: any) => [p.username, "Verified", p.platform, p.matchesPlayed?.toString() || "0", "₦"+Number(p.wallet?.availableBalance||0).toLocaleString(), "Review"]))).finally(() => setLoading(false));
    } else if (view === "Matches") {
      api.getAdminMatches().then(r => setRows(r.map((m: any) => [m.id.substring(0,8), (m.creator?.username||"Unknown") + " vs " + (m.opponent?.username||"Open"), m.platform, "₦"+Number(m.stakeAmount||0).toLocaleString(), m.status, "Inspect"]))).finally(() => setLoading(false));
    } else if (view === "Transactions") {
      api.getAdminTransactions().then(r => setRows(r.map((tx: any) => [tx.id.substring(0,8), tx.user?.username || "Unknown", tx.type, (parseFloat(tx.amount) > 0 ? "+₦" : "-₦") + Math.abs(parseFloat(tx.amount)).toLocaleString(), tx.status, "Receipt"]))).finally(() => setLoading(false));
    } else {
      setRows(dataDef.rows);
      setLoading(false);
    }
  }, [view]);

  return (
    <>
      <ViewHeading
        action={
          <div className="flex gap-2">
            <Button className="h-10 px-4 text-xs" variant="secondary">Export CSV</Button>
            <Button className="h-10 px-4 text-xs">Create report</Button>
          </div>
        }
        copy={`Review and manage ${view.toLowerCase()} across the GoalVault platform.`}
        eyebrow="Operations workspace"
        title={view}
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [rows.length.toString(), "total records"],
          [view === "Risk & Limits" ? "1" : "0", "requires action"],
          ["99.8%", "within service level"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#626772]">{label}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-6 bg-[#181a1f] px-5 py-3">
            {dataDef.headers.map((header, index) => (
              <span className={`text-[8px] font-black uppercase tracking-[0.13em] text-[#5f646e] ${index === 5 ? "text-right" : ""}`} key={header}>
                {header}
              </span>
            ))}
          </div>
          {loading ? (
             <div className="p-8 text-center text-white">Loading data...</div>
          ) : rows.map((row, rowIdx) => (
            <div className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4" key={`${row[0]}-${rowIdx}`}>
              {row.map((cell, index) =>
                index === 5 ? (
                  <div className="text-right" key={cell}>
                    <button className="rounded-md border border-[#34373d] px-3 py-1.5 text-[9px] font-bold text-[#00FF66] transition hover:border-[#00FF66]" type="button">
                      {cell}
                    </button>
                  </div>
                ) : (
                  <span
                    className={`truncate pr-3 text-[10px] ${
                      index === 0 ? "font-bold text-white" : cell === "High" || cell.includes("review") || cell.includes("pending") ? "font-bold text-[#f59e0b]" : "text-[#858a95]"
                    }`}
                    key={`${cell}-${index}`}
                  >
                    {cell}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminSettings() {
  const [duration, setDuration] = useState<number>(6);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>("");

  useEffect(() => {
    api.getMatchDuration()
      .then((res: any) => {
        if (res?.minutes) setDuration(res.minutes);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await api.setMatchDuration(duration);
      setSavedMsg("Settings updated successfully!");
    } catch (e: any) {
      alert(e.message || "Failed to update match duration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ViewHeading
        action={
          <div className="flex items-center gap-3">
            {savedMsg && <span className="text-xs font-bold text-[#00FF66]">{savedMsg}</span>}
            <Button className="h-10 px-5 text-xs" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        }
        copy="Control global platform behavior, settlement rules, and staff permissions."
        eyebrow="Restricted configuration"
        title="Platform settings"
      />
      
      {/* Time To Complete / Match Timer Setting Card */}
      <div className="mb-5 rounded-lg border border-[#00FF66]/30 bg-[#14161a] p-6 shadow-[0_0_30px_rgba(0,255,102,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00FF66]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Default Match Time to Complete</h3>
            </div>
            <p className="mt-1 text-xs text-[#737883]">
              Set how long players have to finish their match and submit scores in the Match Room before results lock or dispute triggers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-11 w-24 rounded-lg border border-[#2b2e35] bg-[#0c0d10] px-3 text-center text-base font-black text-[#00FF66] focus:border-[#00FF66] focus:outline-none"
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Minutes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          ["Escrow & settlement", [["Auto-release verified prizes", true], ["Require evidence above ₦50,000", true], ["Allow manual refunds", false]]],
          ["Player protection", [["Enforce monthly play limits", true], ["Block underage registrations", true], ["Enable cooling-off mode", true]]],
          ["Match integrity", [["Flag repeated disconnects", true], ["Cross-check duplicate devices", true], [`Auto-forfeit after ${duration} minutes`, true]]],
          ["Communications", [["Send transaction receipts", true], ["Notify admins of high-risk stakes", true], ["Weekly operations digest", false]]],
        ].map(([title, settings]) => (
          <article className="rounded-lg border border-[#292c32] bg-[#14161a] p-6" key={title as string}>
            <h3 className="text-sm font-black text-white">{title as string}</h3>
            <div className="mt-4">
              {(settings as (string | boolean)[][]).map(([label, checked]) => (
                <label className="flex items-center justify-between border-t border-[#282b30] py-4 text-[10px] font-semibold text-[#8c919b]" key={label as string}>
                  {label as string}
                  <input className="size-4 accent-[#00FF66]" defaultChecked={checked as boolean} type="checkbox" />
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}


function AdminOverview({ setView }: { setView: (view: AdminView) => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getAdminOverview().then(setData).catch(() => {});
  }, []);

  const metrics = [
    [`${data?.grossVolume || 0}`, "gross stake volume", "+12.8%", "stake"],
    [`${data?.totalPlayers || 0}`, "total players", "verified", "shield"],
    [`${data?.tournamentsCount || 0}`, "active tournaments", "running", "crown"],
    [`${data?.openDisputes || 0}`, "open disputes", "action required", "headset"],
  ];

  return (
    <>
      <ViewHeading
        action={<div className="rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-4 py-2 text-[9px] font-bold text-[#00FF66]">Updated just now</div>}
        copy="Live operational health across players, money movement, and match integrity."
        eyebrow="All systems operational"
        title="Control room"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(([value, label, delta, icon]) => (
          <article className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <div className="flex items-start justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                <Icon name={icon as IconName} size={17} />
              </div>
              <span className="text-[8px] font-bold text-[#00FF66]">{delta}</span>
            </div>
            <p className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#626772]">{label}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.25fr_.75fr] gap-5">
        <article className="rounded-lg border border-[#292c32] bg-[#14161a]">
          <div className="flex items-center justify-between border-b border-[#292c32] px-6 py-4">
            <div>
              <h3 className="text-sm font-black text-white">Stake volume</h3>
              <p className="mt-1 text-[9px] text-[#636872]">Seven-day settled and locked volume</p>
            </div>
            <button className="text-[9px] font-bold text-[#00FF66]" onClick={() => setView("Transactions")} type="button">
              Open ledger →
            </button>
          </div>
          <div className="relative h-[215px] p-6">
            <div className="absolute inset-x-6 top-7 space-y-[42px]">{[0, 1, 2, 3].map((line) => <div className="h-px bg-[#25282d]" key={line} />)}</div>
            <div className="relative flex h-full items-end justify-between gap-3">
              {[42, 58, 46, 72, 66, 88, 78, 96, 83, 112, 101, 132, 118, 148].map((height, index) => (
                <div className="flex flex-1 items-end gap-1" key={index}>
                  <span className="w-1/2 rounded-t-sm bg-[#29332d]" style={{ height }} />
                  <span className="w-1/2 rounded-t-sm bg-[#00FF66]" style={{ height: height * 0.72 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between border-t border-[#292c32] px-6 py-3 text-[8px] uppercase tracking-[0.12em] text-[#565b65]">
            <span>Mon 08</span><span>Tue 09</span><span>Wed 10</span><span>Thu 11</span><span>Fri 12</span><span>Sat 13</span><span>Today</span>
          </div>
        </article>
        <article className="rounded-lg border border-[#292c32] bg-[#14161a]">
          <div className="flex items-center justify-between border-b border-[#292c32] px-5 py-4">
            <h3 className="text-sm font-black text-white">Dispute queue</h3>
            <button className="text-[9px] font-bold text-[#00FF66]" onClick={() => setView("Disputes")} type="button">
              View all
            </button>
          </div>
          <div className="divide-y divide-[#282b30]">
            {data?.openDisputes === 0 ? (
               <div className="p-8 text-center text-xs text-[#626772]">No open disputes</div>
            ) : (
              [["#2048", "Conflicting scores", "$100", "08 min"]].map(([id, reason, value, time], index) => (
                <div className="flex items-center gap-3 p-4" key={id}>
                  <span className={`size-2 rounded-full ${index === 0 ? "bg-[#ef4444]" : "bg-[#f59e0b]"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-white">{id} • {reason}</p>
                    <p className="mt-1 text-[8px] text-[#626772]">{value} exposure</p>
                  </div>
                  <span className="text-[8px] font-bold text-[#858a95]">{time}</span>
                </div>
              ))
            )}
          </div>
          <div className="m-4 rounded-lg border border-[#29332d] bg-[#101612] p-4">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#69746d]">Resolution SLA</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-black text-[#00FF66]">94.2%</p>
              <p className="text-[8px] text-[#666d69]">within 60 minutes</p>
            </div>
          </div>
        </article>
      </div>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="overflow-hidden rounded-lg border border-[#292c32] bg-[#121418]">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-sm font-black text-white">Players requiring attention</h3>
            <button className="text-[9px] font-bold text-[#00FF66]" onClick={() => setView("Players")} type="button">
              Open player controls
            </button>
          </div>
          {[["VantaXI", "Withdrawal velocity anomaly", "High"], ["DrePrime", "Identity verification pending", "Medium"], ["Osei10", "Repeated match disconnections", "Medium"]].map(([player, signal, risk]) => (
            <div className="grid grid-cols-[1fr_1.5fr_80px] items-center border-t border-[#272a2f] px-5 py-3.5" key={player}>
              <p className="text-[10px] font-bold text-white">{player}</p>
              <p className="text-[9px] text-[#717680]">{signal}</p>
              <span className={`text-right text-[8px] font-black uppercase ${risk === "High" ? "text-[#ef4444]" : "text-[#f59e0b]"}`}>{risk}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5">
          <h3 className="text-sm font-black text-white">Platform health</h3>
          <div className="mt-5 space-y-4">
            {[["Match verification", "99.99%"], ["Wallet service", "100%"], ["Identity provider", "99.96%"], ["Notification queue", "99.92%"]].map(([service, uptime]) => (
              <div className="flex items-center justify-between" key={service}>
                <span className="flex items-center gap-2 text-[9px] text-[#777c86]">
                  <span className="size-1.5 rounded-full bg-[#00FF66]" />
                  {service}
                </span>
                <span className="text-[9px] font-bold text-white">{uptime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminClient() {
  const [view, setView] = useState<AdminView>("Overview");
  const navigation: { label: AdminView; icon: IconName; badge?: string }[] = [
    { label: "Overview", icon: "grid" },
    { label: "Players", icon: "shield", badge: "3" },
    { label: "Matches", icon: "controller", badge: "184" },
    { label: "Disputes", icon: "headset", badge: "4" },
    { label: "Transactions", icon: "wallet" },
    { label: "Tournaments", icon: "crown", badge: "7" },
    { label: "Risk & Limits", icon: "lock", badge: "1" },
    { label: "Settings", icon: "stake" },
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
          {navigation.map((item) => (
            <button
              className={`flex h-10 items-center gap-3 rounded-lg px-3 text-left text-[10px] font-bold whitespace-nowrap transition ${
                view === item.label ? "bg-[#00FF66]/10 text-[#00FF66]" : "text-[#858a95] hover:bg-white/[0.04] hover:text-white"
              }`}
              key={item.label}
              onClick={() => setView(item.label)}
              type="button"
            >
              <Icon name={item.icon} size={16} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`rounded px-1.5 py-0.5 text-[8px] ${view === item.label ? "bg-[#00FF66] text-[#07140c]" : "bg-[#26292e] text-[#7e838d]"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto hidden lg:block rounded-lg border border-[#332f25] bg-[#17150f] p-4">
          <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#f59e0b]">Audit mode enabled</p>
          <p className="mt-2 text-[9px] leading-4 text-[#797363]">Every administrative action is logged and attributed to your session.</p>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-[#25282d] px-2 pt-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-[9px] font-black">AO</div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate">Amara Okafor</p>
            <p className="mt-0.5 text-[8px] text-[#626772]">Super administrator</p>
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
            <p className="mt-1 text-xs font-bold text-white">Production environment <span className="ml-2 text-[#00FF66]">• Healthy</span></p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex size-10 items-center justify-center rounded-lg border border-[#2b2e34] text-[#7d828c]" type="button">
              <Icon name="bolt" size={16} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#ef4444]" />
            </button>
            <div className="rounded-lg border border-[#2b2e34] bg-[#15171b] px-4 py-2">
              <p className="text-[8px] uppercase tracking-[0.12em] text-[#5f646e]">Today’s volume</p>
              <p className="mt-1 text-xs font-black text-white">₦12,840,000</p>
            </div>
          </div>
        </header>

        {/* View Body */}
        <main className="flex-1 px-6 lg:px-8 py-7 overflow-y-auto">
          {view === "Overview" && <AdminOverview setView={setView} />}
          {view === "Settings" && <AdminSettings />}
          {view !== "Overview" && view !== "Settings" && <AdminTableView view={view} />}
        </main>
      </div>
    </div>
  );
}
