"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ViewHeading } from "../page";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminTournaments()
      .then(setTournaments)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeading
        copy="Live tournament brackets, registration counts, and escrow prize pools fetched from the database."
        eyebrow="Tournament management"
        title="Tournaments"
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [tournaments.length.toString(), "tournaments in database"],
          [`₦${tournaments.reduce((sum, t) => sum + Number(t.totalPrizePool || 0), 0).toLocaleString()}`, "aggregate prize pool"],
          [tournaments.reduce((sum, t) => sum + Number(t.joinedPlayers || 0), 0).toString(), "registered entrants"],
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
            <span>Tournament</span>
            <span>Host</span>
            <span>Platform / Mode</span>
            <span>Players</span>
            <span>Prize Pool</span>
            <span className="text-right">Status</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737883]">Loading tournaments from database...</div>
          ) : tournaments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737883]">No tournaments found in database.</div>
          ) : (
            tournaments.map((t) => (
              <div
                className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4 text-[10px]"
                key={t.id}
              >
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-[9px] text-[#636872]">{t.format || "Single elimination"}</p>
                </div>
                <span className="font-bold text-white">{t.host?.username || "efChamps Admin"}</span>
                <div>
                  <p className="text-[#858a95]">{t.platform}</p>
                  <p className="text-[9px] text-[#636872]">{t.gameMode}</p>
                </div>
                <span className="text-white font-bold">
                  {t.joinedPlayers} / {t.maxPlayers}
                </span>
                <span className="font-bold text-[#00FF66]">
                  ₦{Number(t.totalPrizePool || 0).toLocaleString()}
                </span>
                <div className="text-right">
                  <span className={`rounded px-2.5 py-1 text-[9px] font-bold ${
                    t.status === "OPEN"
                      ? "bg-[#00FF66]/10 text-[#00FF66]"
                      : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {t.status}
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
