"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ViewHeading } from "../page";

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminPlayers()
      .then(setPlayers)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeading
        copy="Live database user accounts and wallet statuses across all gaming platforms."
        eyebrow="Database records"
        title="Players"
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [players.length.toString(), "registered players"],
          [players.filter(p => p.isActive !== false).length.toString(), "active accounts"],
          [players.filter(p => Number(p.wallet?.availableBalance || 0) > 0).length.toString(), "funded wallets"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#626772]">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-6 bg-[#181a1f] px-5 py-3 text-[8px] font-black uppercase tracking-[0.13em] text-[#5f646e]">
            <span>Username</span>
            <span>Platform</span>
            <span>Division</span>
            <span>Matches / Win Rate</span>
            <span>Wallet Balance</span>
            <span className="text-right">Action</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737883]">Loading players from database...</div>
          ) : players.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737883]">No players found in database.</div>
          ) : (
            players.map((player) => (
              <div
                className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4 text-[10px]"
                key={player.id}
              >
                <div>
                  <p className="font-bold text-white">{player.username}</p>
                  <p className="text-[9px] text-[#636872]">{player.email}</p>
                </div>
                <span className="text-[#858a95] font-semibold">{player.platform || "Cross-play"}</span>
                <span className="text-[#858a95]">{player.division || "Division 1"}</span>
                <span className="text-[#858a95]">
                  {player.matchesPlayed || 0} ({player.winRate || 0}%)
                </span>
                <span className="font-bold text-[#00FF66]">
                  ₦{Number(player.wallet?.availableBalance || 0).toLocaleString()}
                </span>
                <div className="text-right">
                  <span className="rounded bg-[#00FF66]/10 px-2.5 py-1 text-[9px] font-bold text-[#00FF66]">
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
