"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { ViewHeading } from "../page";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDisputes()
      .then(setDisputes)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeading
        copy="Live database dispute queue for contested match outcomes and player score disagreements."
        eyebrow="Integrity management"
        title="Match Disputes"
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [disputes.length.toString(), "total disputes in database"],
          [disputes.filter(d => d.status === "IN_REVIEW").length.toString(), "pending review"],
          [disputes.filter(d => d.status === "RESOLVED").length.toString(), "resolved disputes"],
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
            <span>Dispute ID</span>
            <span>Match</span>
            <span>Raised By</span>
            <span>Reason</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737883]">Loading disputes from database...</div>
          ) : disputes.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#737883]">
              No active dispute records found in database. All matches settled normally.
            </div>
          ) : (
            disputes.map((d) => (
              <div
                className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4 text-[10px]"
                key={d.id}
              >
                <div>
                  <span className="font-mono font-bold text-white">#{d.id.substring(0, 8)}</span>
                  <p className="text-[9px] text-[#636872]">{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-[#858a95] font-mono">#{d.match?.id?.substring(0, 8) || "N/A"}</span>
                <span className="font-bold text-white">{d.raisedBy?.username || "Unknown"}</span>
                <span className="text-[#858a95] truncate pr-2">{d.reason || "Conflicting scores"}</span>
                <div>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                    d.status === "IN_REVIEW"
                      ? "bg-[#ef4444]/10 text-[#ef4444]"
                      : "bg-[#00FF66]/10 text-[#00FF66]"
                  }`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-right">
                  <Link
                    href={`/match/${d.match?.id}`}
                    className="rounded-md border border-[#34373d] px-3 py-1.5 text-[9px] font-bold text-[#00FF66] transition hover:border-[#00FF66]"
                  >
                    Inspect Match
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
