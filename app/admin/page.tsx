"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import { Icon, type IconName } from "../components/ui";

export function ViewHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
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

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getAdminOverview().then(setData).catch(() => {});
  }, []);

  const metrics = [
    [`₦${Number(data?.grossVolume || 0).toLocaleString()}`, "gross stake volume", "Live Database", "stake"],
    [`${data?.totalPlayers || 0}`, "total players", "verified", "shield"],
    [`${data?.tournamentsCount || 0}`, "active tournaments", "running", "crown"],
    [`${data?.openDisputes || 0}`, "open disputes", data?.openDisputes > 0 ? "action required" : "clear", "headset"],
  ];

  return (
    <>
      <ViewHeading
        action={
          <div className="rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-4 py-2 text-[9px] font-bold text-[#00FF66]">
            Live Database Sync
          </div>
        }
        copy="Live operational health across players, stakes, money movement, and match integrity."
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
        <article className="rounded-lg border border-[#292c32] bg-[#14161a] p-6">
          <div className="flex items-center justify-between border-b border-[#292c32] pb-4">
            <div>
              <h3 className="text-sm font-black text-white">System Status & Summary</h3>
              <p className="mt-1 text-[9px] text-[#636872]">Real-time telemetry and database integrity</p>
            </div>
            <Link href="/admin/transactions" className="text-[9px] font-bold text-[#00FF66] hover:underline">
              Open ledger →
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-[#282b30] bg-[#0c0d10] p-4">
              <div>
                <p className="text-xs font-bold text-white">Active 1v1 Matches</p>
                <p className="text-[10px] text-[#737883]">Currently in progress across platforms</p>
              </div>
              <span className="text-xl font-black text-[#00FF66]">{data?.liveMatches || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#282b30] bg-[#0c0d10] p-4">
              <div>
                <p className="text-xs font-bold text-white">Registered Competitors</p>
                <p className="text-[10px] text-[#737883]">Live database player accounts</p>
              </div>
              <span className="text-xl font-black text-white">{data?.totalPlayers || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#282b30] bg-[#0c0d10] p-4">
              <div>
                <p className="text-xs font-bold text-white">Today&apos;s Transaction Volume</p>
                <p className="text-[10px] text-[#737883]">Settled and escrowed volume</p>
              </div>
              <span className="text-xl font-black text-white">₦{Number(data?.todayVolume || 0).toLocaleString()}</span>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-[#292c32] bg-[#14161a]">
          <div className="flex items-center justify-between border-b border-[#292c32] px-5 py-4">
            <h3 className="text-sm font-black text-white">Dispute queue</h3>
            <Link href="/admin/disputes" className="text-[9px] font-bold text-[#00FF66]">
              View all →
            </Link>
          </div>
          <div className="p-6">
            {!data?.openDisputes || data?.openDisputes === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#00FF66]/10 text-[#00FF66]">
                  <Icon name="check" size={20} />
                </div>
                <p className="mt-3 text-xs font-bold text-white">Dispute Queue Clear</p>
                <p className="mt-1 text-[10px] text-[#636872]">No active player score disputes recorded in the database.</p>
              </div>
            ) : (
              <div className="rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/5 p-4 text-center">
                <p className="text-xs font-bold text-[#ef4444]">{data.openDisputes} Case(s) Require Review</p>
                <Link href="/admin/disputes" className="mt-2 inline-block text-[10px] font-bold text-white underline">
                  Resolve in Disputes View
                </Link>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
