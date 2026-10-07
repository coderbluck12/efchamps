"use client";

import { useState, useEffect, type ReactNode } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand, Button, Field, Icon, SelectField, type IconName } from "../components/ui";

export type DashboardView =
  | "Match Lobby"
  | "My Active Stakes"
  | "Tournaments"
  | "Secure Wallet"
  | "Leaderboard"
  | "Support"
  | "Profile";

export type ModalType = "challenge" | "funds" | "withdraw";




export function MatchCard({ match, onAccepted }: { match: any; onAccepted?: () => void }) {
  const { user, refreshUser } = useAuth();
  const [cancelling, setCancelling] = useState(false);
  const initials = match.creator?.username?.substring(0, 2).toUpperCase() || "??";
  const tone = "from-[#1d4ed8] to-[#60a5fa]";
  const isCreator = user?.id === match.creator?.id;

  const handleCancelChallenge = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Are you sure you want to cancel this challenge? Your stake of ₦${Number(match.stakeAmount).toLocaleString()} will be refunded to your wallet immediately.`)) {
      return;
    }
    try {
      setCancelling(true);
      await api.cancelMatch(match.id);
      await refreshUser();
      if (onAccepted) onAccepted();
    } catch (err: any) {
      alert(err.message || "Failed to cancel challenge");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <article className="group rounded-lg border border-[#292c32] bg-[#14161a] p-5 transition hover:-translate-y-0.5 hover:border-[#00FF66]/35 hover:shadow-[0_18px_40px_rgba(0,0,0,.3)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex size-11 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-xs font-black text-white ring-2 ring-[#292c32]`}>
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{match.creator?.username}</h3>
              {isCreator ? (
                <span className="rounded bg-[#00FF66]/15 px-1.5 py-0.5 text-[8px] font-black uppercase text-[#00FF66]">You</span>
              ) : (
                <span className="size-1.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
              )}
            </div>
            <p className="mt-1 text-[10px] font-semibold text-[#676c77]">{match.creator?.division || "DIVISION 2"} • Win Rate: {match.creator?.winRate || "0"}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#30333a] bg-[#0f1114] px-2.5 py-1.5 text-[10px] font-bold text-[#9ca1ab]">
          {match.platform === "Mobile" ? <Icon name="mobile" size={14} /> : <Icon name="gamepad" size={14} />}
          {match.platform}
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between rounded-lg border border-white/[0.05] bg-[#0e1013] px-4 py-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#5f646e]">Entry stake</p>
          <p className="mt-1 text-lg font-black text-white">₦{Number(match.stakeAmount).toLocaleString()}</p>
        </div>
        <div className="h-8 w-px bg-[#292c31]" />
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#5f646e]">Prize pool</p>
          <p className="mt-1 text-lg font-black text-[#00FF66]">₦{Number(match.prizePool).toLocaleString()}</p>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between text-[10px] font-semibold text-[#6d727d]">
        <span>{match.format}</span>
        <span>{match.teamRules}</span>
      </div>
      <div className="flex gap-2">
        <Link href={`/match/${match.id}`} className="flex-1">
          <Button className="h-11 w-full text-xs" variant="primary">
            View Challenge <Icon name="arrow" size={16} />
          </Button>
        </Link>
        {isCreator && (
          <Button
            className="h-11 px-3 text-xs border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
            onClick={handleCancelChallenge}
            disabled={cancelling}
            type="button"
          >
            {cancelling ? "..." : "Cancel"}
          </Button>
        )}
      </div>
    </article>
  );
}

export function ViewHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
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

export function LobbyView() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = () => {
    api.getOpenMatches().then(setMatches).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <>
      <ViewHeading
        action={<Button className="h-10 px-4 text-xs" variant="secondary">Match rules</Button>}
        copy="Find open challenges and commit your stake to play."
        eyebrow="Match Lobby"
        title="Open Matches"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-8 text-center text-white">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="col-span-full mt-5 rounded-lg border border-dashed border-[#30343b] p-6 text-center">
            <p className="text-xs font-bold text-[#8b909a]">No open matches</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard key={match.id} match={match} onAccepted={fetchMatches} />
          ))
        )}
      </div>
    </>
  );
}
export function ActiveStakesView() {
  const { user } = useAuth();
  const [stakes, setStakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStakes = () => {
    api.getMyActiveMatches().then(setStakes).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStakes();
  }, []);

  return (
    <>
      <ViewHeading
        action={<Button className="h-10 px-4 text-xs" variant="secondary">Match rules</Button>}
        copy="Live stakes stay locked until both players verify the result."
        eyebrow={`${stakes.length} matches in play`}
        title="Active stakes"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [`${user?.wallet?.escrowLockedBalance || "0.00"}`, "capital in play", "stake"],
          [`${((user?.wallet?.escrowLockedBalance || 0) * 1.8).toFixed(2)}`, "potential return", "bolt"],
          [`${user?.winRate || "0"}%`, "30-day win rate", "crown"],
        ].map(([value, label, icon]) => (
          <div className="flex items-center gap-4 rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
              <Icon name={icon as IconName} />
            </div>
            <div>
              <p className="text-xl font-black text-white">{value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#666b75]">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {loading ? (
           <div className="p-8 text-center text-white">Loading stakes...</div>
        ) : stakes.length === 0 ? (
           <div className="mt-5 rounded-lg border border-dashed border-[#30343b] p-6 text-center">
             <p className="text-xs font-bold text-[#8b909a]">No other stakes in progress</p>
             <p className="mt-1 text-[10px] text-[#565b65]">Finished matches move to your performance history automatically.</p>
           </div>
        ) : (
          stakes.map((stake, index) => {
            const opponent = stake.creator?.id === user?.id ? stake.opponent : stake.creator;
            const initials = opponent?.username?.substring(0, 2).toUpperCase() || "??";
            const tone = "from-[#7c3aed] to-[#c084fc]";
            return (
              <article className="relative overflow-hidden rounded-lg border border-[#2b2e34] bg-[#14161a]" key={stake.id}>
                <div className="absolute inset-y-0 left-0 w-1 bg-[#00FF66]" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-xs font-black`}>{initials}</div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#626772]">You vs</p>
                      <h3 className="mt-1 font-bold text-white truncate max-w-[180px] sm:max-w-none">{opponent?.username || "Waiting for opponent..."}</h3>
                      <p className="mt-1 text-[10px] text-[#626772]">{stake.platform} • Division 2</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-6 border-y border-white/5 py-3 lg:border-y-0 lg:py-0">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.13em] text-[#5e636e]">Your stake</p>
                      <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-black text-white">₦{Number(stake.stakeAmount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.13em] text-[#5e636e]">Prize pool</p>
                      <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-black text-[#00FF66]">₦{Number(stake.prizePool).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.13em] text-[#5e636e]">{stake.status}</p>
                      <p className="mt-1 sm:mt-2 text-sm sm:text-2xl font-black text-white">—</p>
                    </div>
                  </div>
                  <Link href={`/match/${stake.id}`} className="w-full sm:w-auto">
                    <Button className="h-10 px-4 text-xs w-full sm:w-auto justify-center" variant={index === 0 ? "primary" : "secondary"}>
                      Open Match Room
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}


export function WalletView() { const [localModal, setLocalModal] = useState<ModalType | null>(null);
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    api.getTransactions().then(setTransactions).catch(() => {});
  }, []);

  const balance = user?.wallet?.availableBalance || 0;
  const locked = user?.wallet?.escrowLockedBalance || 0;
  const winnings = user?.wallet?.lifetimeWinnings || 0;

  return (
    <>
      {localModal && <ActionModal type={localModal} onClose={() => setLocalModal(null)} />}
      <ViewHeading
        action={
          <div className="flex gap-2">
            <Button className="h-10 px-4 text-xs" onClick={() => setLocalModal("withdraw")} variant="secondary">Withdraw</Button>
            <Button className="h-10 px-4 text-xs" onClick={() => setLocalModal("funds")}><Icon name="plus" size={15} /> Add funds</Button>
          </div>
        }
        copy="Your money, movement, and limits in one secure place."
        eyebrow="Wallet protected"
        title="Secure wallet"
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_.65fr] gap-5">
        <div className="relative overflow-hidden rounded-lg border border-[#00FF66]/25 bg-[#121914] p-7">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[#00FF66]/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6f8476]">Available balance</p>
                <p className="mt-3 text-4xl sm:text-5xl font-black tracking-[-0.05em] text-white">₦{parseFloat(balance as any).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="mt-2 text-xs text-[#708077]">Available instantly</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]">
                <Icon name="wallet" />
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-[#29352d] pt-5">
              <div><p className="text-[9px] uppercase text-[#607067]">Locked in stakes</p><p className="mt-1 font-bold text-white">₦{parseFloat(locked as any).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
              <div><p className="text-[9px] uppercase text-[#607067]">Lifetime winnings</p><p className="mt-1 font-bold text-[#00FF66]">₦{parseFloat(winnings as any).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
              <div><p className="text-[9px] uppercase text-[#607067]">Wallet ID</p><p className="mt-1 font-mono text-xs text-white">•••• {user?.wallet?.id?.substring(0,4) || "8024"}</p></div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6">
          <p className="text-xs font-bold text-white">Monthly play limit</p>
          <p className="mt-2 text-[10px] leading-4 text-[#686d77]">You’ve used ₦{(user?.wallet?.monthlyUsed || 0).toLocaleString()} of your ₦{(user?.wallet?.monthlyLimit || 300000).toLocaleString()} responsible play limit.</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#25282d]">
            <div className="h-full rounded-full bg-[#00FF66]" style={{ width: `${Math.min(100, ((user?.wallet?.monthlyUsed || 0) / (user?.wallet?.monthlyLimit || 300000)) * 100)}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-[10px]">
            <span className="text-[#00FF66]">₦{(user?.wallet?.monthlyUsed || 0).toLocaleString()} used</span>
            <span className="text-[#666b75]">₦{((user?.wallet?.monthlyLimit || 300000) - (user?.wallet?.monthlyUsed || 0)).toLocaleString()} remaining</span>
          </div>
          <Button className="mt-6 h-10 w-full text-xs" variant="secondary">Manage limits</Button>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="flex items-center justify-between border-b border-[#292c32] px-6 py-4">
          <h3 className="text-sm font-bold text-white">Recent activity</h3>
          <button className="text-[10px] font-bold text-[#00FF66]" type="button">View all transactions</button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#646973]">No recent transactions.</div>
            ) : transactions.map((tx) => (
              <div className="grid grid-cols-[1fr_140px_90px] sm:grid-cols-[1fr_160px_100px] items-center border-b border-[#25282d] px-4 sm:px-6 py-4 last:border-b-0" key={tx.id}>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-white/[0.04] text-[#8c919b]">
                    <Icon name="stake" size={15} />
                  </div>
                  <p className="text-xs font-semibold text-white truncate max-w-[160px] sm:max-w-none">{tx.type} • {tx.description || tx.type}</p>
                </div>
                <p className="text-[10px] text-[#646973]">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className={`text-right text-xs font-black ${parseFloat(tx.amount) > 0 ? "text-[#00FF66]" : "text-white"}`}>
                  {parseFloat(tx.amount) > 0 ? "+" : ""}₦{parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


export function LeaderboardView() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    api.getLeaderboard().then(setLeaders).catch(() => {});
  }, []);

  return (
    <>
      <ViewHeading
        action={<Button className="h-10 px-4 text-xs" variant="secondary">All platforms <Icon name="chevron" size={14} /></Button>}
        copy="The sharpest players this season, ranked by verified performance."
        eyebrow="Season 08 • Week 3"
        title="Global leaderboard"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaders.slice(0, 3).map((player, i) => {
          const index = i === 0 ? 1 : i === 1 ? 0 : 2;
          const actualPlayer = leaders[index];
          if(!actualPlayer) return null;
          return (
          <div className={`relative overflow-hidden rounded-lg border p-6 text-center ${index === 0 ? "border-[#00FF66]/35 bg-[#152019]" : "border-[#292c32] bg-[#14161a]"}`} key={actualPlayer.id}>
            <div className="absolute left-4 top-4 text-3xl font-black text-white/[0.06]">0{actualPlayer.rank}</div>
            <div className={`mx-auto flex size-15 items-center justify-center rounded-full bg-gradient-to-br from-[#30343b] to-[#626a76] text-sm font-black text-white ${index === 0 ? "ring-2 ring-[#00FF66]" : ""}`}>{actualPlayer.username.substring(0,2).toUpperCase()}</div>
            <p className="mt-4 font-bold text-white">{actualPlayer.username}</p>
            <p className="mt-1 text-[10px] text-[#6b707a]">{actualPlayer.platform} • {actualPlayer.division}</p>
            <div className="mt-5 flex justify-center gap-7 border-t border-[#2a2d32] pt-4">
              <div><p className="text-sm font-black text-[#00FF66]">{actualPlayer.winRate}</p><p className="text-[8px] uppercase text-[#60656f]">Win rate</p></div>
              <div><p className="text-sm font-black text-white">{String(actualPlayer.lifetimeWinnings || "₦0").replace(/^\$/, "₦")}</p><p className="text-[8px] uppercase text-[#60656f]">Won</p></div>
            </div>
          </div>
        )})}
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[60px_1fr_90px_90px_110px] sm:grid-cols-[70px_1fr_120px_120px_130px] bg-[#17191d] px-4 sm:px-6 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#5f646e]">
              <span>Rank</span><span>Player</span><span>Platform</span><span>Win rate</span><span className="text-right">Total won</span>
            </div>
            {leaders.map((player) => (
              <div className={`grid grid-cols-[60px_1fr_90px_90px_110px] sm:grid-cols-[70px_1fr_120px_120px_130px] items-center border-t border-[#26292e] px-4 sm:px-6 py-3.5 ${player.id === user?.id ? "bg-[#00FF66]/[0.06]" : ""}`} key={player.id}>
                <span className={`text-xs font-black ${player.id === user?.id ? "text-[#00FF66]" : "text-[#727782]"}`}>#{player.rank}</span>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#2b2f36] text-[9px] font-black">{player.username.substring(0,2).toUpperCase()}</div>
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">{player.username} {player.id === user?.id && <span className="ml-1 text-[8px] text-[#00FF66]">YOU</span>}</span>
                </div>
                <span className="text-xs text-[#7b808a]">{player.platform}</span>
                <span className="text-xs font-bold text-white">{player.winRate}</span>
                <span className="text-right text-xs font-bold text-white">{String(player.lifetimeWinnings || "₦0").replace(/^\$/, "₦")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function SupportView() {
  return (
    <>
      <ViewHeading copy="Fast answers for match, wallet, and account questions." eyebrow="Average response • 4 min" title="Player support" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-5">
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-7">
          <div className="flex size-11 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="headset" /></div>
          <h3 className="mt-6 text-2xl font-black text-white">What can we solve?</h3>
          <p className="mt-2 text-xs text-[#747984]">Search the playbook or start a priority conversation.</p>
          <div className="mt-6 flex h-13 items-center rounded-lg border border-[#34373e] bg-[#0e1013] px-4 focus-within:border-[#00FF66]">
            <Icon name="grid" size={17} />
            <input className="h-full flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-[#555a64]" placeholder="Search match rules, withdrawals, disputes..." />
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Report a match result", "Payment & withdrawals", "Account security", "Fair play & disputes"].map((topic) => (
              <button className="rounded-lg border border-[#2a2d33] bg-[#101216] p-4 text-left text-xs font-semibold text-[#a2a7b0] transition hover:border-[#00FF66]/40 hover:text-white" key={topic} type="button">
                {topic}
                <span className="mt-3 block text-[#00FF66]">Explore →</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#00FF66]/25 bg-[#121914] p-6">
            <div className="flex items-center gap-2 text-[#00FF66]">
              <span className="size-2 rounded-full bg-[#00FF66]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Agents online</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-white">Talk to a match specialist</h3>
            <p className="mt-2 text-xs leading-5 text-[#717a74]">Get help from someone who understands stakes, result verification, and platform rules.</p>
            <Button className="mt-6 h-11 w-full text-xs">Start live chat</Button>
          </div>
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6">
            <p className="text-xs font-bold text-white">Your open ticket</p>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-[#0e1013] p-4">
              <div>
                <p className="text-xs font-semibold text-white">#SX-2048 • Result review</p>
                <p className="mt-1 text-[10px] text-[#636872]">Updated 8 minutes ago</p>
              </div>
              <span className="rounded bg-[#f59e0b]/10 px-2 py-1 text-[9px] font-bold text-[#f59e0b]">IN REVIEW</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export function ProfileView() {
  const { user } = useAuth();
  const initials = user?.username?.substring(0,2).toUpperCase() || "??";
  return (
    <>
      <ViewHeading
        action={<Button className="h-10 px-4 text-xs">Save changes</Button>}
        copy="Your public competitive identity and private account controls."
        eyebrow="Verified player"
        title="Player profile"
      />
      <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-5">
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-7 text-center">
          <div className="relative mx-auto w-fit">
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-2xl font-black ring-4 ring-[#22262b]">{initials}</div>
            <span className="absolute bottom-1 right-1 size-5 rounded-full border-4 border-[#14161a] bg-[#00FF66]" />
          </div>
          <h3 className="mt-5 text-xl font-black text-white">{user?.username}</h3>
          <p className="mt-1 text-xs text-[#737883]">Konami ID • {user?.konamiId || "Not linked"}</p>
          <div className="mx-auto mt-4 w-fit rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#00FF66]">Identity verified</div>
          <div className="mt-7 grid grid-cols-3 border-y border-[#292c32] py-4">
            <div><p className="font-black text-white">{user?.division?.replace("Division ", "") || "2"}</p><p className="text-[8px] uppercase text-[#5f646e]">Division</p></div>
            <div><p className="font-black text-white">{user?.winRate || 0}%</p><p className="text-[8px] uppercase text-[#5f646e]">Win rate</p></div>
            <div><p className="font-black text-white">{user?.matchesPlayed || 0}</p><p className="text-[8px] uppercase text-[#5f646e]">Matches</p></div>
          </div>
          <Button className="mt-6 h-10 w-full text-xs" variant="secondary">Change avatar</Button>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6">
            <h3 className="text-sm font-bold text-white">Player details</h3>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Gamertag" placeholder={user?.username || "Username"} />
              <Field label="Email address" placeholder={user?.email || "Email"} />
              <Field label="Konami eFootball ID" placeholder={user?.konamiId || "KON-ID"} />
              <SelectField />
            </div>
          </div>
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6">
            <h3 className="text-sm font-bold text-white">Competitive preferences</h3>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Open to challenges", "Match reminders", "Public match history"].map((setting) => (
                <label className="flex items-center justify-between rounded-lg border border-[#2b2e34] bg-[#101216] p-4 text-[10px] font-semibold text-[#9ba0aa]" key={setting}>
                  {setting}
                  <input className="accent-[#00FF66]" defaultChecked type="checkbox" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateTournamentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [bracketSize, setBracketSize] = useState(8);
  const [format, setFormat] = useState("Single elimination");
  const [stakePerPlayer, setStakePerPlayer] = useState("2000");
  const [platform, setPlatform] = useState("PS5");
  const [gameMode, setGameMode] = useState("Dream Team");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a tournament name");
      return;
    }
    const numericStake = Number(stakePerPlayer);
    if (isNaN(numericStake) || numericStake < 500) {
      setError("Minimum stake per player is ₦500");
      return;
    }
    const userBalance = Number(user?.wallet?.availableBalance || 0);
    if (userBalance < numericStake) {
      setError(`Insufficient balance. You need ₦${numericStake.toLocaleString()} but have ₦${userBalance.toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.createTournament({
        name: name.trim(),
        maxPlayers: bracketSize,
        stakePerPlayer: numericStake,
        format,
        gameMode,
        platform,
      });
      await refreshUser();
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  const stakeNum = Number(stakePerPlayer) || 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto" onMouseDown={onClose}>
      <div className="relative my-auto w-full max-w-[560px] max-h-[92vh] flex flex-col overflow-hidden rounded-xl border border-[#34383e] bg-[#121418] shadow-[0_30px_100px_rgba(0,0,0,.8)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="h-1 bg-[#00FF66] shrink-0" />
        <button aria-label="Close modal" className="absolute right-5 top-5 z-10 flex size-8 items-center justify-center rounded-md border border-[#30343a] text-lg text-[#777c86] hover:border-[#00FF66] hover:text-white" onClick={onClose} type="button">×</button>
        <div className="border-b border-[#292c32] px-6 sm:px-7 pb-5 pt-6 shrink-0">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="crown" size={19} /></div>
          <p className="mt-4 text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Tournament builder</p>
          <h2 className="mt-1.5 text-xl sm:text-2xl font-black tracking-[-0.035em] text-white">Create a custom tournament</h2>
          <p className="mt-1.5 text-xs leading-5 text-[#747984]">Set the bracket, stake, and match rules. The lobby opens when you publish.</p>
        </div>

        {error && (
          <div className="mx-6 sm:mx-7 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 shrink-0">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Tournament Name</label>
            <input
              className="h-12 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] placeholder-[#555a64] outline-none focus:border-[#00FF66]"
              placeholder="e.g. Friday Night Knockout"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Bracket size</span>
              <select
                className="h-12 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"
                value={bracketSize}
                onChange={(e) => setBracketSize(Number(e.target.value))}
              >
                <option value={8}>8 players</option>
                <option value={16}>16 players</option>
                <option value={32}>32 players</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Format</span>
              <select
                className="h-12 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="Single elimination">Single elimination</option>
                <option value="Double elimination">Double elimination</option>
                <option value="Round robin">Round robin</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Stake Per Player (₦)</span>
              <input
                type="number"
                min="500"
                step="500"
                className="h-12 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"
                placeholder="2000"
                value={stakePerPlayer}
                onChange={(e) => setStakePerPlayer(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Platform</span>
              <select
                className="h-12 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="PS5">PlayStation 5</option>
                <option value="Xbox">Xbox Series X/S</option>
                <option value="PC">PC</option>
                <option value="Mobile">eFootball Mobile</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Game mode</span>
              <select
                className="h-12 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
              >
                <option value="Dream Team">Dream Team</option>
                <option value="Authentic Team">Authentic Team</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Estimated Prize Pool</span>
              <div className="flex h-12 w-full items-center rounded-lg border border-[#2a2d33] bg-[#101216] px-4 font-mono text-sm font-black text-[#00FF66]">
                ₦{(stakeNum * bracketSize).toLocaleString()}
              </div>
            </label>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-[#29332d] bg-[#101612] p-4">
            <Icon name="lock" size={17} />
            <p className="text-[10px] leading-4 text-[#738078]">
              Your <strong className="text-white">₦{stakeNum.toLocaleString()}</strong> host stake will be locked into escrow when published.
            </p>
          </div>

            <div className="flex gap-3 pt-1">
              <Button className="h-12 flex-1 text-xs" onClick={onClose} variant="secondary" type="button">
                Cancel
              </Button>
              <Button className="h-12 flex-[1.6] text-xs" type="submit" disabled={loading}>
                {loading ? "Publishing..." : "Publish Tournament"} <Icon name="arrow" size={16} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function TournamentDetailView({ tournamentId, onBack }: { tournamentId: string; onBack: () => void }) {
  const { user, refreshUser } = useAuth();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("Manchester City");
  const [error, setError] = useState<string | null>(null);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const data = await api.getTournamentById(tournamentId);
      setTournament(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tournament");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
  }, [tournamentId]);

  const handleJoin = async () => {
    if (!tournament) return;
    try {
      setJoining(true);
      setError(null);
      await api.joinTournament(tournament.id, selectedTeam);
      await refreshUser();
      await fetchTournament();
    } catch (err: any) {
      setError(err.message || "Failed to join tournament");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-[#00FF66] border-t-transparent" />
        <p className="text-xs text-[#888d98]">Loading tournament details...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="rounded-lg border border-[#2b2e34] bg-[#14161a] p-8 text-center">
        <p className="text-sm text-red-400">{error || "Tournament not found"}</p>
        <Button className="mt-4 h-9 text-xs" onClick={onBack} variant="secondary">
          ← Back to Tournaments
        </Button>
      </div>
    );
  }

  const isParticipant = tournament.participants?.some((p: any) => p.user?.id === user?.id);
  const isFull = (tournament.joinedPlayers || 0) >= tournament.maxPlayers;
  const openSlotsCount = Math.max(0, tournament.maxPlayers - (tournament.participants?.length || 0));

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-[-80px] top-[-100px] size-[420px] rounded-full bg-[#00FF66]/[0.025] blur-[110px]" />
      <div className="relative">
        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr_.8fr] items-center gap-6 border-b border-[#292c32] py-7">
          <div>
            <button className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#777c86] transition hover:text-[#00FF66]" onClick={onBack} type="button">
              ← All tournaments
            </button>
            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">{tournament.maxPlayers}-player tournament</p>
            <h1 className="mt-2 text-2xl sm:text-[30px] font-black tracking-[-0.045em] text-white">{tournament.name}</h1>
            <p className="mt-2 text-xs text-[#727782]">Hosted by: <span className="font-bold text-white">{tournament.host?.username || "Host"}</span></p>
          </div>
          <div className="mx-auto flex w-full max-w-[410px] items-center rounded-lg border border-[#2d3430] bg-[#111713] px-5 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="lock" size={19} /></div>
            <div className="ml-4 pr-6">
              <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#68716b]">Stake per player</p>
              <p className="mt-1 text-base font-black text-white">₦{Number(tournament.stakePerPlayer).toLocaleString()}</p>
            </div>
            <div className="h-9 w-px bg-[#303732]" />
            <div className="pl-6">
              <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#68716b]">Total escrow pool</p>
              <p className="mt-1 text-base font-black text-[#00FF66]">₦{Number(tournament.totalPrizePool).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex lg:justify-end">
            <div className="flex items-center gap-3 rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-4 py-2.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00FF66] opacity-60" />
                <span className="relative size-2 rounded-full bg-[#00FF66]" />
              </span>
              <span className="text-[10px] font-bold text-[#b8c1bb]">
                {tournament.status === "OPEN" ? `Waiting for Players (${tournament.joinedPlayers}/${tournament.maxPlayers})` : tournament.status}
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 py-7">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#00FF66]">Player allocation</p>
                <h2 className="mt-1.5 text-xl font-black text-white">Registered Participants</h2>
              </div>
              <div className="flex items-center gap-4 text-[9px] text-[#646973]">
                <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#00FF66]" /> Stake locked</span>
                <span className="flex items-center gap-2"><span className="size-2 rounded-full border border-[#626771]" /> Open</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tournament.participants?.map((participant: any, index: number) => {
                const isHost = participant.user?.id === tournament.host?.id;
                const initials = participant.user?.username?.substring(0, 2).toUpperCase() || `P${index + 1}`;
                const tones = [
                  "from-[#164e63] to-[#22d3ee]",
                  "from-[#1e40af] to-[#60a5fa]",
                  "from-[#6b21a8] to-[#c084fc]",
                  "from-[#065f46] to-[#34d399]",
                  "from-[#9f1239] to-[#fb7185]",
                  "from-[#854d0e] to-[#facc15]",
                ];
                const tone = tones[index % tones.length];

                return (
                  <article className="relative flex min-h-[132px] items-center rounded-lg border border-[#2b2e34] bg-[#14161a] p-5" key={participant.id || index}>
                    <span className="absolute right-4 top-3 text-3xl font-black text-white/[0.035]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-xs font-black text-white ring-2 ring-[#2e3238]`}>
                      {initials}
                    </div>
                    <div className="ml-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-black text-white">{participant.user?.username}</h3>
                        {isHost && <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] font-bold uppercase text-[#8d929c]">Host</span>}
                      </div>
                      <p className="mt-1 text-[9px] font-mono text-[#626772]">{participant.user?.efootballUsername || "Konami User"}</p>
                      <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold text-[#999ea8]">
                        <Icon name="controller" size={13} /> {participant.selectedTeam || "Custom Team"}
                      </div>
                    </div>
                    <div className="ml-auto self-end rounded-md bg-[#00FF66]/10 px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-[#00FF66]">
                      <span className="mr-1">✓</span> Stake locked
                    </div>
                  </article>
                );
              })}

              {/* Join or Open Slots */}
              {!isParticipant && !isFull && (
                <article className="relative flex min-h-[132px] flex-col justify-center overflow-hidden rounded-lg border border-[#00FF66] bg-[#121b15] p-5 shadow-[0_0_35px_rgba(0,255,102,.1)]">
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,transparent_45%,rgba(0,255,102,.08)_45%,rgba(0,255,102,.08)_55%,transparent_55%)] [background-size:18px_18px]" />
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#00FF66]">Join Slot Available</span>
                      <span className="text-[10px] font-bold text-white">₦{Number(tournament.stakePerPlayer).toLocaleString()}</span>
                    </div>
                    <div>
                      <label className="mb-1 block text-[8px] font-bold uppercase text-[#777c86]">Select In-Game Club</label>
                      <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="h-8 w-full rounded border border-[#2b3a30] bg-[#0c140e] px-2 text-[10px] text-white outline-none focus:border-[#00FF66]"
                      >
                        <option value="Manchester City">Manchester City</option>
                        <option value="Real Madrid">Real Madrid</option>
                        <option value="FC Barcelona">FC Barcelona</option>
                        <option value="Arsenal FC">Arsenal FC</option>
                        <option value="Bayern München">Bayern München</option>
                        <option value="Paris Saint-Germain">Paris Saint-Germain</option>
                        <option value="Liverpool FC">Liverpool FC</option>
                        <option value="Inter Milan">Inter Milan</option>
                      </select>
                    </div>
                    <Button className="h-9 w-full text-[10px]" onClick={handleJoin} disabled={joining}>
                      {joining ? "Locking Stake..." : `Join & Lock ₦${Number(tournament.stakePerPlayer).toLocaleString()}`}
                    </Button>
                  </div>
                </article>
              )}

              {Array.from({ length: Math.max(0, (!isParticipant && !isFull ? openSlotsCount - 1 : openSlotsCount)) }).map((_, slotIdx) => (
                <article className="group flex min-h-[132px] items-center justify-center rounded-lg border border-dashed border-[#34383f] bg-[#101216] transition hover:border-[#00FF66]/35" key={slotIdx}>
                  <div className="text-center">
                    <div className="mx-auto flex size-9 items-center justify-center rounded-full border border-[#34383f] text-[#696e78]">
                      <Icon name="plus" size={16} />
                    </div>
                    <p className="mt-3 text-xs font-bold text-[#686d77]">Open Slot</p>
                    <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#444951]">Slot {tournament.participants.length + (isParticipant ? 1 : 2) + slotIdx}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-[#2b2e34] bg-[#14161a]">
            <div className="border-b border-[#2b2e34] p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="controller" size={19} /></div>
              <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-[#00FF66]">Tournament config</p>
              <h2 className="mt-2 text-xl font-black text-white">Match rules</h2>
              <p className="mt-2 text-[10px] leading-4 text-[#686d77]">Settings are locked by the host and apply to every round.</p>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                {[
                  ["Format", tournament.format || "Single elimination"],
                  ["Platform", tournament.platform || "PS5"],
                  ["Game Mode", tournament.gameMode || "Dream Team"],
                  ["Match Time", "10 mins"],
                  ["Extra Time", "On"],
                  ["Penalties", "On"],
                ].map(([label, value]) => (
                  <div className="flex items-center justify-between border-b border-[#272a2f] py-3 last:border-b-0" key={label}>
                    <span className="text-[10px] text-[#686d77]">{label}</span>
                    <span className="text-[10px] font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-l-2 border-[#f59e0b] bg-[#f59e0b]/[0.06] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#f59e0b]">Forfeit warning</p>
                <p className="mt-2 text-[10px] leading-5 text-[#9a8b73]">Disconnections or failure to submit match scores within 30 minutes of round generation will result in a forfeit of your locked stake.</p>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#29332d] bg-[#101612] p-3">
                <Icon name="shield" size={16} />
                <p className="text-[9px] leading-4 text-[#6e7b72]">Escrow releases automatically after the final tournament round is verified.</p>
              </div>
            </div>
          </aside>
        </section>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#292c32] py-5">
          <p className="text-[9px] uppercase tracking-[0.12em] text-[#555a64]">
            Bracket generates automatically when all {tournament.maxPlayers} player stakes are locked.
          </p>
          <div className="flex items-center gap-4 text-[9px] font-bold text-[#777c86]">
            <span>{tournament.format}</span>
            <span className="size-1 rounded-full bg-[#44484f]" />
            <span>Escrow Protected</span>
            <span className="size-1 rounded-full bg-[#44484f]" />
            <span>Total Pool: ₦{Number(tournament.totalPrizePool).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TournamentView() {
  const { user } = useAuth();
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Open");

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await api.getTournaments();
      setTournaments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  if (selectedTournament) {
    return <TournamentDetailView tournamentId={selectedTournament} onBack={() => { setSelectedTournament(null); fetchTournaments(); }} />;
  }

  const filteredTournaments = tournaments.filter((t) => {
    if (filter === "Open") return t.status === "OPEN";
    if (filter === "Live") return t.status === "STARTING" || t.status === "IN_PROGRESS";
    if (filter === "Completed") return t.status === "COMPLETED";
    if (filter === "My Tournaments") {
      const isHost = t.host?.id === user?.id;
      const isParticipant = t.participants?.some((p: any) => p.user?.id === user?.id);
      return isHost || isParticipant;
    }
    return true;
  });

  const featured = tournaments[0] || null;

  return (
    <div className="relative">
      <ViewHeading
        action={<Button className="h-11 px-5 text-xs" onClick={() => setCreating(true)}><Icon name="plus" size={16} /> Create Tournament</Button>}
        copy="Find an open bracket, follow live rounds, or host a tournament on your terms."
        eyebrow={`${tournaments.length} tournament${tournaments.length === 1 ? "" : "s"} in database`}
        title="Tournament arena"
      />

      {featured && (
        <section className="relative mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden rounded-lg border border-[#00FF66]/25 bg-gradient-to-r from-[#15251a] to-[#111512] px-7 py-5">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[#00FF66]/10 blur-3xl" />
          <div className="relative flex items-center gap-5">
            <div className="flex size-13 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]"><Icon name="crown" size={23} /></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#00FF66] px-2 py-0.5 text-[7px] font-black uppercase text-[#07140c]">Featured</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#748078]">Official efChamps Event</span>
              </div>
              <h2 className="mt-2 text-xl font-black text-white">{featured.name}</h2>
              <p className="mt-1 text-[10px] text-[#778078]">
                {featured.maxPlayers} players • ₦{Number(featured.stakePerPlayer).toLocaleString()} entry • ₦{Number(featured.totalPrizePool).toLocaleString()} locked prize pool • {featured.platform}
              </p>
            </div>
          </div>
          <Button className="relative h-10 px-5 text-[10px]" onClick={() => setSelectedTournament(featured.id)} variant="secondary">
            View Tournament <Icon name="arrow" size={14} />
          </Button>
        </section>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-[#292c32] bg-[#121418] p-1">
          {["Open", "Live", "My Tournaments", "Completed"].map((tab) => (
            <button
              className={`rounded-md px-4 py-2 text-[9px] font-bold transition ${filter === tab ? "bg-[#00FF66] text-[#07140c]" : "text-[#777c86] hover:text-white"}`}
              key={tab}
              onClick={() => setFilter(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-lg border border-[#292c32] bg-[#14161a] p-12">
          <div className="size-7 animate-spin rounded-full border-2 border-[#00FF66] border-t-transparent" />
          <p className="text-xs text-[#888d98]">Loading tournaments from database...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-[#292c32] bg-[#14161a] p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#00FF66]/10 text-[#00FF66]">
            <Icon name="crown" size={20} />
          </div>
          <h3 className="mt-4 text-sm font-bold text-white">No tournaments in this section</h3>
          <p className="mt-1 text-xs text-[#727782]">Create a tournament bracket or switch filter tabs.</p>
          <Button className="mt-4 h-9 px-4 text-xs" onClick={() => setCreating(true)}>
            Create Tournament
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTournaments.map((tournament) => {
            const joined = tournament.joinedPlayers || 0;
            const max = tournament.maxPlayers || 8;
            const percent = Math.min(100, Math.round((joined / max) * 100));
            const accent = "from-[#143823] to-[#101713]";

            return (
              <article className="group overflow-hidden rounded-lg border border-[#292c32] bg-[#14161a] transition hover:-translate-y-0.5 hover:border-[#00FF66]/35" key={tournament.id}>
                <div className={`h-16 bg-gradient-to-r ${accent} px-5 py-4`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#00FF66]">
                        {tournament.platform} • {tournament.gameMode || "Dream Team"}
                      </p>
                      <h3 className="mt-1 truncate text-sm font-black text-white">{tournament.name}</h3>
                    </div>
                    <span className={`rounded px-2 py-1 text-[7px] font-black uppercase ${tournament.status === "OPEN" ? "bg-[#00FF66]/10 text-[#00FF66]" : "bg-white/[0.07] text-[#9ca1ab]"}`}>
                      {tournament.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-[#656a74]">Hosted by <b className="text-[#a4a9b2]">{tournament.host?.username || "Host"}</b></span>
                    <span className="font-bold text-[#8d929c]">{tournament.format}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 border-y border-[#292c32] py-3">
                    <div>
                      <p className="text-[7px] uppercase text-[#5d626c]">Entry</p>
                      <p className="mt-1 text-sm font-black text-white">₦{Number(tournament.stakePerPlayer).toLocaleString()}</p>
                    </div>
                    <div className="border-l border-[#292c32] pl-3">
                      <p className="text-[7px] uppercase text-[#5d626c]">Pool</p>
                      <p className="mt-1 text-sm font-black text-[#00FF66]">₦{Number(tournament.totalPrizePool).toLocaleString()}</p>
                    </div>
                    <div className="border-l border-[#292c32] pl-3">
                      <p className="text-[7px] uppercase text-[#5d626c]">Format</p>
                      <p className="mt-1 text-[9px] font-bold text-white">{max} players</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-[8px]">
                      <span className="text-[#686d77]">{joined}/{max} players joined</span>
                      <span className="font-bold text-[#00FF66]">{percent}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#272a2f]">
                      <div className="h-full rounded-full bg-[#00FF66]" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <Button className="mt-4 h-9 w-full text-[9px]" onClick={() => setSelectedTournament(tournament.id)} variant={tournament.status === "OPEN" ? "primary" : "secondary"}>
                    {tournament.status === "OPEN" ? "View & Join Tournament" : "View Bracket Details"} <Icon name="arrow" size={13} />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {creating && (
        <CreateTournamentModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            fetchTournaments();
          }}
        />
      )}
    </div>
  );
}

export function ActionModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("2500");
  const [customMsg, setCustomMsg] = useState<string>("");

  const details = {
    challenge: {
      eyebrow: "New head-to-head",
      title: "Create a challenge",
      copy: "Set the terms, lock your stake, and publish the match to the live lobby.",
      icon: "controller" as IconName,
      action: "Lock Stake & Publish",
      success: "Challenge published",
      successCopy: "Your stake is locked and the challenge is now visible in the match lobby.",
    },
    funds: {
      eyebrow: "Secure wallet deposit",
      title: "Add funds via Paystack",
      copy: "Top up your playable balance in Naira instantly via Paystack (Cards, Bank Transfer, USSD).",
      icon: "plus" as IconName,
      action: `Pay ₦${Number(depositAmount || 0).toLocaleString()} with Paystack`,
      success: "Funds added",
      successCopy: `₦${Number(depositAmount || 0).toLocaleString()} has been credited to your available efChamps balance.`,
    },
    withdraw: {
      eyebrow: "Wallet withdrawal",
      title: "Withdraw winnings",
      copy: "Move available funds from your efChamps wallet to your verified Nigerian bank account.",
      icon: "wallet" as IconName,
      action: "Withdraw Funds",
      success: "Withdrawal requested",
      successCopy: "Your request is being processed and usually arrives in your bank account shortly.",
    },
  }[type];

  const handlePaystackDeposit = (amount: number) => {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_ad3318423a57a88f4333a2cdb89bab5d0c6acc83";
    const userEmail = user?.email || "player@efchamps.com";
    const ref = "GV_" + Math.floor(Math.random() * 1000000000 + 1);

    const onPaymentSuccess = function (response: any) {
      const reference = response?.reference || response?.trxref || ref;
      setLoading(true);
      api.verifyPaystack(reference, amount)
        .then(async () => {
          await refreshUser();
          setComplete(true);
        })
        .catch((err: any) => {
          alert(err.message || "Failed to verify transaction");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const onPaymentClose = function () {
      setLoading(false);
    };

    if (typeof window !== "undefined" && (window as any).PaystackPop) {
      try {
        const paystackInstance = new (window as any).PaystackPop();
        if (typeof paystackInstance.newTransaction === "function") {
          paystackInstance.newTransaction({
            key: paystackKey,
            email: userEmail,
            amount: Math.round(amount * 100),
            currency: "NGN",
            reference: ref,
            onSuccess: onPaymentSuccess,
            onCancel: onPaymentClose,
          });
          return;
        }
      } catch {
        // Fallback to legacy PaystackPop.setup
      }

      try {
        const handler = (window as any).PaystackPop.setup({
          key: paystackKey,
          email: userEmail,
          amount: Math.round(amount * 100), // in kobo
          currency: "NGN",
          ref: ref,
          onClose: onPaymentClose,
          callback: onPaymentSuccess,
        });
        if (handler && typeof handler.openIframe === "function") {
          handler.openIframe();
          return;
        }
      } catch (err) {
        console.warn("Paystack setup error, falling back:", err);
      }
    }

    // Direct fallback if Paystack script cannot be opened
    api.deposit(amount, "Paystack Direct")
      .then(async () => {
        await refreshUser();
        setComplete(true);
      })
      .catch((e: any) => alert(e.message || "Deposit failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto" onMouseDown={onClose}>
      <div className="relative my-auto w-full max-w-[540px] max-h-[92vh] flex flex-col overflow-hidden rounded-xl border border-[#34383e] bg-[#121418] shadow-[0_30px_100px_rgba(0,0,0,.8)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="h-1 w-full bg-[#00FF66] shrink-0" />
        <button aria-label="Close modal" className="absolute right-5 top-5 z-10 flex size-8 items-center justify-center rounded-md border border-[#30343a] text-lg text-[#777c86] transition hover:border-[#00FF66] hover:text-white" onClick={onClose} type="button">×</button>
        {!complete ? (
          <>
            <div className="border-b border-[#292c32] px-6 sm:px-7 pb-5 pt-6 shrink-0">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name={details.icon} size={19} /></div>
              <p className="mt-4 text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">{details.eyebrow}</p>
              <h2 className="mt-1.5 text-xl sm:text-2xl font-black tracking-[-0.035em] text-white">{details.title}</h2>
              <p className="mt-1.5 text-xs leading-5 text-[#747984]">{details.copy}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
              <form className="space-y-4" onSubmit={async (event: any) => {
              event.preventDefault();
              setLoading(true);
              try {
                const formData = new FormData(event.target);
                if (type === "challenge") {
                  const amt = parseFloat(formData.get("amount") as string || "1000");
                  const selectedPlatform = (formData.get("platform") as string) || "PS5";
                  const created = await api.createMatch({
                    platform: selectedPlatform,
                    stakeAmount: amt,
                    format: (formData.get("format") as string) || "1v1 • 10 min",
                    teamRules: (formData.get("teamRules") as string) || "Standard teams"
                  });
                  await refreshUser();
                  if (created?.id) {
                    onClose();
                    router.push(`/match/${created.id}`);
                    return;
                  }
                  setComplete(true);
                } else if (type === "funds") {
                  const amt = parseFloat(depositAmount || "2500");
                  handlePaystackDeposit(amt);
                  return;
                } else if (type === "withdraw") {
                  const amt = parseFloat(formData.get("amount") as string || "1000");
                  await api.withdraw(amt, (formData.get("accountNumber") as string) || "Bank Account");
                  await refreshUser();
                  setComplete(true);
                }
              } catch (e: any) {
                alert(e.message || "Action failed");
              } finally {
                if (type !== "funds") setLoading(false);
              }
            }}>
              {type === "challenge" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField name="platform" options={["PS5", "Xbox", "PC", "Mobile"]} />
                    <Field label="Entry Stake (₦)" name="amount" placeholder="1000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Match Time" name="format" placeholder="10 minutes" />
                    <Field label="Team Rules" name="teamRules" placeholder="Standard teams" />
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Challenge visibility</span>
                    <select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>Public lobby</option><option>Invite only</option></select>
                  </label>
                  <div className="flex items-start gap-3 rounded-lg border border-[#29332d] bg-[#101612] p-4">
                    <Icon name="lock" size={17} />
                    <p className="text-[10px] leading-4 text-[#738078]">The stake will move from your available balance into secure escrow when this challenge is published.</p>
                  </div>
                </>
              )}
              {type === "funds" && (
                <>
                  <Field 
                    label="Deposit Amount (₦)" 
                    name="amount" 
                    placeholder="2500" 
                    value={depositAmount}
                    onChange={(e: any) => setDepositAmount(e.target.value)} 
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {["1000", "2500", "5000", "10000"].map((amount) => (
                      <button 
                        className={`h-9 rounded-lg border text-[10px] font-bold ${depositAmount === amount ? "border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]" : "border-[#2d3036] text-[#7c818b]"}`} 
                        key={amount} 
                        type="button"
                        onClick={() => setDepositAmount(amount)}
                      >
                        ₦{Number(amount).toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg border border-[#29332d] bg-[#101612] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded bg-[#00FF66]/10 text-[#00FF66]">
                        <Icon name="shield" size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Paystack Gateway</p>
                        <p className="text-[10px] text-[#738078]">Cards • Bank Transfer • USSD • Apple Pay</p>
                      </div>
                    </div>
                    <span className="rounded bg-[#00FF66]/15 px-2 py-0.5 text-[9px] font-bold text-[#00FF66]">INSTANT</span>
                  </div>
                  <div className="flex justify-between border-y border-[#292c32] py-4 text-xs">
                    <span className="text-[#717680]">You pay</span>
                    <span className="font-black text-white">₦{Number(depositAmount || 0).toLocaleString()}</span>
                  </div>
                </>
              )}
              {type === "withdraw" && (
                <>
                  <div className="rounded-lg border border-[#29332d] bg-[#101612] p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#68736c]">Available to withdraw</p>
                    <p className="mt-2 text-2xl font-black text-white">₦{parseFloat((user?.wallet?.availableBalance as any) || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <Field label="Withdrawal Amount (₦)" name="amount" placeholder="2500" />
                  <Field label="Account Number" name="accountNumber" placeholder="0123456789" />
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Destination Bank</span>
                    <select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]">
                      <option>Access Bank</option>
                      <option>GTBank</option>
                      <option>Zenith Bank</option>
                      <option>First Bank of Nigeria</option>
                      <option>Kuda Bank</option>
                      <option>OPay</option>
                      <option>PalmPay</option>
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-4 border-y border-[#292c32] py-4 text-[10px]">
                    <div><p className="text-[#656a74]">Processing fee</p><p className="mt-1 font-bold text-white">₦0.00</p></div>
                    <div><p className="text-[#656a74]">Estimated arrival</p><p className="mt-1 font-bold text-white">Instant / 10 mins</p></div>
                  </div>
                </>
              )}
                <div className="flex gap-3 pt-1">
                  <Button className="h-12 flex-1 text-xs" onClick={onClose} variant="secondary">Cancel</Button>
                  <Button className="h-12 flex-[1.7] text-xs" type="submit" disabled={loading}>
                    {loading ? "Processing..." : details.action} <Icon name="arrow" size={16} />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex min-h-[430px] flex-col items-center justify-center p-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#00FF66] text-[#07140c] shadow-[0_0_40px_rgba(0,255,102,.25)]"><Icon name="check" size={28} /></div>
            <p className="mt-7 text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Transaction confirmed</p>
            <h2 className="mt-2 text-2xl font-black text-white">{details.success}</h2>
            <p className="mt-3 max-w-[350px] text-xs leading-5 text-[#747984]">{details.successCopy}</p>
            <Button className="mt-8 h-11 px-8 text-xs" onClick={onClose}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}

