"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { ViewHeading } from "../page";

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminMatches()
      .then(setMatches)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeading
        copy="Live database match records, participant pairings, and settlement states."
        eyebrow="Match oversight"
        title="1v1 Matches"
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [matches.length.toString(), "total matches in database"],
          [matches.filter(m => m.status === "OPEN").length.toString(), "open challenges"],
          [matches.filter(m => m.status === "IN_PROGRESS" || m.status === "ACCEPTED").length.toString(), "live in-progress"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#626772]">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-6 bg-[#181a1f] px-5 py-3 text-[8px] font-black uppercase tracking-[0.13em] text-[#5f646e]">
            <span>Match ID</span>
            <span>Participants</span>
            <span>Platform</span>
            <span>Stake / Prize</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737883]">Loading matches from database...</div>
          ) : matches.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737883]">No matches found in database.</div>
          ) : (
            matches.map((m) => (
              <div
                className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4 text-[10px]"
                key={m.id}
              >
                <div>
                  <span className="font-mono font-bold text-white">#{m.id.substring(0, 8)}</span>
                  <p className="text-[9px] text-[#636872]">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-bold text-white">{m.creator?.username || "Unknown"}</p>
                  <p className="text-[9px] text-[#636872]">vs {m.opponent?.username || "(Awaiting Joiner)"}</p>
                </div>
                <span className="text-[#858a95] font-semibold">{m.platform}</span>
                <div>
                  <p className="text-white">₦{Number(m.stakeAmount || 0).toLocaleString()}</p>
                  <p className="text-[9px] text-[#00FF66]">Pool: ₦{Number(m.prizePool || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                    m.status === "OPEN"
                      ? "bg-blue-500/10 text-blue-400"
                      : m.status === "IN_PROGRESS"
                      ? "bg-[#00FF66]/10 text-[#00FF66]"
                      : m.status === "DISPUTED"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="text-right">
                  <Link
                    href={`/match/${m.id}`}
                    className="rounded-md border border-[#34373d] px-3 py-1.5 text-[9px] font-bold text-[#00FF66] transition hover:border-[#00FF66]"
                  >
                    View Room
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
