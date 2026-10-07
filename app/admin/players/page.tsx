"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ViewHeading } from "../page";

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPlayers = () => {
    api.getAdminPlayers()
      .then(setPlayers)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleToggleAdmin = async (player: any) => {
    const newRole = player.role === "ADMIN" ? "PLAYER" : "ADMIN";
    const actionText = newRole === "ADMIN" ? `grant Administrator privileges to "${player.username}"` : `remove Administrator privileges from "${player.username}"`;
    
    if (!confirm(`Are you sure you want to ${actionText}?`)) {
      return;
    }

    setUpdatingId(player.id);
    try {
      await api.updateUserRole(player.id, newRole);
      fetchPlayers();
    } catch (err: any) {
      alert(err.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <ViewHeading
        copy="Live database user accounts, roles, and wallet statuses across all gaming platforms."
        eyebrow="Database records"
        title="Players & Role Management"
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [players.length.toString(), "registered players"],
          [players.filter(p => p.role === "ADMIN").length.toString(), "platform admins"],
          [players.filter(p => Number(p.wallet?.availableBalance || 0) > 0).length.toString(), "funded wallets"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#626772]">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] bg-[#181a1f] px-5 py-3 text-[8px] font-black uppercase tracking-[0.13em] text-[#5f646e]">
            <span>User Account</span>
            <span>Platform</span>
            <span>Role</span>
            <span>Matches / Win Rate</span>
            <span>Wallet Balance</span>
            <span className="text-right">Admin Role Action</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737883]">Loading players from database...</div>
          ) : players.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737883]">No players found in database.</div>
          ) : (
            players.map((player) => {
              const isAdmin = player.role === "ADMIN";
              const isUpdating = updatingId === player.id;

              return (
                <div
                  className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] items-center border-t border-[#272a2f] px-5 py-4 text-[10px]"
                  key={player.id}
                >
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      {player.username}
                      {isAdmin && (
                        <span className="rounded bg-[#f59e0b]/20 px-1.5 py-0.2 text-[7px] font-black uppercase text-[#f59e0b]">
                          ADMIN
                        </span>
                      )}
                    </p>
                    <p className="text-[9px] text-[#636872]">{player.email}</p>
                  </div>
                  <span className="text-[#858a95] font-semibold">{player.platform || "Cross-play"}</span>
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[8px] font-black uppercase ${
                        isAdmin
                          ? "border border-[#f59e0b]/40 bg-[#f59e0b]/15 text-[#f59e0b]"
                          : "border border-white/10 bg-white/5 text-[#9ca1ab]"
                      }`}
                    >
                      {player.role || "PLAYER"}
                    </span>
                  </div>
                  <span className="text-[#858a95]">
                    {player.matchesPlayed || 0} ({player.winRate || 0}%)
                  </span>
                  <span className="font-bold text-[#00FF66]">
                    ₦{Number(player.wallet?.availableBalance || 0).toLocaleString()}
                  </span>
                  <div className="text-right">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleToggleAdmin(player)}
                      className={`rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition disabled:opacity-50 ${
                        isAdmin
                          ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                          : "border border-[#00FF66]/30 bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66] hover:text-[#06150c]"
                      }`}
                    >
                      {isUpdating ? "Saving..." : isAdmin ? "Revoke Admin" : "Make Admin ★"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
