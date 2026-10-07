"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ViewHeading } from "../page";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminTransactions()
      .then(setTransactions)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ViewHeading
        copy="Live database ledger of deposits, stake locks, withdrawals, and escrow settlements."
        eyebrow="Financial ledger"
        title="Transactions"
      />
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [transactions.length.toString(), "recorded transactions"],
          [`₦${transactions
            .filter((t) => t.type === "DEPOSIT")
            .reduce((sum, t) => sum + Number(t.amount || 0), 0)
            .toLocaleString()}`, "total deposits"],
          [`₦${transactions
            .filter((t) => t.type === "STAKE_LOCKED")
            .reduce((sum, t) => sum + Number(t.amount || 0), 0)
            .toLocaleString()}`, "total stakes locked"],
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
            <span>Tx ID</span>
            <span>Player</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-right">Timestamp</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737883]">Loading ledger from database...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737883]">No transactions found in database.</div>
          ) : (
            transactions.map((tx) => (
              <div
                className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4 text-[10px]"
                key={tx.id}
              >
                <div>
                  <span className="font-mono font-bold text-white">#{tx.id.substring(0, 8)}</span>
                  <p className="text-[9px] text-[#636872]">{tx.description || "System transaction"}</p>
                </div>
                <span className="font-bold text-white">{tx.wallet?.user?.username || "Player"}</span>
                <span className="text-[#858a95] font-semibold">{tx.type}</span>
                <span className={`font-black ${
                  tx.type === "DEPOSIT" || tx.type === "PRIZE_WON" ? "text-[#00FF66]" : "text-white"
                }`}>
                  ₦{Number(tx.amount || 0).toLocaleString()}
                </span>
                <div>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                    tx.status === "COMPLETED"
                      ? "bg-[#00FF66]/10 text-[#00FF66]"
                      : tx.status === "ESCROW"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <span className="text-right text-[#636872] text-[9px]">
                  {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
