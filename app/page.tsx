"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand, Button, Icon, type IconName } from "./components/ui";
import { api } from "./lib/api";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    // 1. Fetch live open challenges
    api.getOpenMatches()
      .then((data) => {
        if (Array.isArray(data)) setMatches(data);
      })
      .catch((err) => console.error("Error fetching landing matches:", err))
      .finally(() => setLoadingMatches(false));

    // 2. Fetch live leaderboard players
    api.getLeaderboard()
      .then((data) => {
        if (Array.isArray(data)) setLeaderboard(data);
      })
      .catch((err) => console.error("Error fetching landing leaderboard:", err))
      .finally(() => setLoadingLeaderboard(false));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0C0D10] text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute right-[-180px] top-20 size-[760px] rounded-full bg-[#00FF66]/[0.055] blur-[150px]" />

      {/* Navigation Header */}
      <header className="relative z-30 mx-auto max-w-[1280px] px-4 sm:px-6 mt-4 sm:mt-8 flex h-16 sm:h-20 items-center justify-between border-b border-white/[0.07]">
        <Brand />
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[11px] font-bold uppercase tracking-[0.11em] text-[#8d929d]">
          <a className="border-b-2 border-[#00FF66] py-7 text-white" href="#home">Home</a>
          <a className="transition hover:text-white" href="#lobby">Live Lobby</a>
          <a className="transition hover:text-white" href="#leaderboards">Rankings</a>
          <a className="transition hover:text-white" href="#how-it-works">How it works</a>
          <Link className="transition hover:text-[#00FF66]" href="/admin">Admin Console</Link>
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          <Button className="px-3.5 py-2 text-xs" href="/login" variant="ghost">Login</Button>
          <Button className="h-10 px-5 text-xs" href="/register">Sign Up</Button>
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/login" className="text-xs font-bold text-white px-2.5 py-1.5 rounded-lg border border-[#2b2e35] bg-[#14161a]">
            Login
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-lg border border-[#2b2e35] bg-[#14161a] text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="size-5 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="relative z-40 border-b border-[#292c32] bg-[#0f1115] px-6 py-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-[#9ba0ab]">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-white"
            >
              <span>Home</span>
              <span className="text-[#00FF66]">●</span>
            </a>
            <a
              href="#lobby"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 hover:text-white"
            >
              <span>Live Lobby</span>
              <Icon name="arrow" size={14} />
            </a>
            <a
              href="#leaderboards"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 hover:text-white"
            >
              <span>Rankings</span>
              <Icon name="arrow" size={14} />
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 hover:text-white"
            >
              <span>How it works</span>
              <Icon name="arrow" size={14} />
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/5 py-2 text-[#00FF66]"
            >
              <span>Admin Console</span>
              <Icon name="arrow" size={14} />
            </Link>
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button className="h-12 w-full text-xs" href="/register">
              Create Player Account
            </Button>
            <Button className="h-12 w-full text-xs" href="/dashboard" variant="secondary">
              Go to Match Lobby
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        {/* Hero Section */}
        <section className="grid min-h-[520px] sm:min-h-[580px] grid-cols-1 lg:grid-cols-[48%_52%] items-center py-8 sm:py-12" id="home">
          <div className="relative z-10">
            <p className="mb-3 sm:mb-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#00FF66]">The pitch is open // Season 08</p>
            <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[76px] font-black uppercase leading-[0.92] sm:leading-[0.9] tracking-[-0.05em] sm:tracking-[-0.065em] text-white">
              Own the match.
              <span className="mt-2 sm:mt-3 block text-[#00FF66]">Take the pot.</span>
            </h1>
            <p className="mt-5 sm:mt-8 max-w-[500px] text-sm sm:text-base leading-6 sm:leading-7 text-[#969ba6]">
              Put real stakes behind your eFootball skill. Challenge verified players, settle results securely, and let every goal mean more.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button className="h-12 sm:h-14 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto justify-center" href="/dashboard">
                Enter the live lobby <Icon name="arrow" size={18} />
              </Button>
              <Button className="h-12 sm:h-14 px-5 sm:px-6 text-xs sm:text-sm w-full sm:w-auto justify-center" href="#how-it-works" variant="secondary">
                <Icon name="controller" size={18} /> See how it works
              </Button>
            </div>
            <div className="mt-9 flex items-center gap-8">
              {["PS5", "XBOX", "PC", "MOBILE"].map((platform) => (
                <span className="text-[10px] font-black tracking-[0.18em] text-[#5e636d]" key={platform}>{platform}</span>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 h-[460px] lg:h-[540px] overflow-hidden rounded-xl border border-white/[0.05]">
            <div className="absolute inset-10 rotate-[-6deg] border border-[#00FF66]/25 [clip-path:polygon(20%_0,100%_15%,88%_100%,0_84%)]" />
            <div className="absolute inset-16 rotate-[7deg] border border-[#00FF66]/10 [clip-path:polygon(20%_0,100%_15%,88%_100%,0_84%)]" />
            <img
              alt="Black game controller in dramatic light"
              className="absolute inset-0 size-full scale-105 object-cover object-center mix-blend-lighten"
              src="https://images.unsplash.com/photo-1543328011-1c0d628fae09?auto=format&fit=crop&w=1200&q=90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#0C0D10_0%,transparent_35%,transparent_75%,#0C0D10_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,#0C0D10_0%,transparent_38%)]" />
            <div className="absolute bottom-10 right-6 border-l-2 border-[#00FF66] bg-black/75 px-5 py-3 backdrop-blur-md">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#00FF66]">Live challenges</p>
              <p className="mt-1 text-2xl font-black text-white">147</p>
            </div>
          </div>
        </section>

        {/* Next Event Banner */}
        <section className="relative my-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#00FF66]/25 bg-[#101315] px-7 py-6 [clip-path:polygon(0_0,98.5%_0,100%_28%,100%_100%,1.5%_100%,0_72%)]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Next community event</p>
            <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.03em] text-white">Weekend winner-takes-all <span className="text-[#00FF66]">Cup</span></h2>
          </div>
          <div className="flex gap-6 sm:gap-8">
            {[["01", "Days"], ["09", "Hrs"], ["42", "Mins"], ["18", "Secs"]].map(([value, label]) => (
              <div className="text-center" key={label}>
                <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.15em] text-[#676c77]">{label}</p>
              </div>
            ))}
          </div>
          <Button className="h-11 px-5 text-xs" href="/dashboard" variant="secondary">
            View event rules <Icon name="arrow" size={15} />
          </Button>
        </section>

        {/* Featured Stakes / Lobby Teaser */}
        <section className="py-16" id="lobby">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Live Arena</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Featured Stakes</h2>
            </div>
            <Link className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#00FF66] hover:underline" href="/dashboard">
              View all challenges ({matches.length}) <Icon name="arrow" size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingMatches ? (
              /* Skeleton Loader Grid */
              Array.from({ length: 3 }).map((_, idx) => (
                <article key={idx} className="relative overflow-hidden rounded-lg border border-[#23262d] bg-[#121418] p-5 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-full bg-[#242831]" />
                    <div className="h-5 w-16 rounded bg-[#242831]" />
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="h-4 w-28 rounded bg-[#242831]" />
                    <div className="h-3 w-20 rounded bg-[#1c1f26]" />
                  </div>
                  <div className="mt-6 grid grid-cols-2 border-y border-[#20232a] py-4 gap-4">
                    <div className="space-y-1">
                      <div className="h-2 w-10 rounded bg-[#1c1f26]" />
                      <div className="h-5 w-16 rounded bg-[#242831]" />
                    </div>
                    <div className="space-y-1 border-l border-[#20232a] pl-4">
                      <div className="h-2 w-12 rounded bg-[#1c1f26]" />
                      <div className="h-5 w-16 rounded bg-[#242831]" />
                    </div>
                  </div>
                  <div className="mt-4 h-10 w-full rounded-lg bg-[#242831]" />
                </article>
              ))
            ) : matches.length === 0 ? (
              /* Empty state if database has no active open challenges */
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-lg border border-dashed border-[#2b2e35] bg-[#121418]/60 p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
                <div className="size-12 rounded-full bg-[#00FF66]/10 text-[#00FF66] flex items-center justify-center mb-3">
                  <Icon name="controller" size={24} />
                </div>
                <h3 className="text-sm font-black uppercase text-white">No Open Challenges Right Now</h3>
                <p className="mt-1 text-xs text-[#737883] max-w-sm">
                  Be the first player to post a challenge in the arena. Lock your stake, share your room code, and take the prize pool!
                </p>
                <Button className="mt-4 h-10 px-6 text-xs" href="/dashboard">
                  Create First Challenge →
                </Button>
              </div>
            ) : (
              /* Live Data Cards from Real Database */
              matches.slice(0, 3).map((match, index) => {
                const creator = match.creator?.username || "Player";
                const initials = creator.substring(0, 2).toUpperCase();
                const stake = Number(match.stakeAmount || 0).toLocaleString();
                const pool = Number(match.prizePool || 0).toLocaleString();
                const platform = match.platform || "PS5";

                return (
                  <article
                    className={`relative overflow-hidden border bg-[#131519] p-5 rounded-lg transition hover:border-[#00FF66]/50 ${
                      index === 0 ? "border-[#00FF66]/80 shadow-[0_0_20px_rgba(0,255,102,0.06)]" : "border-[#2b2e34]"
                    }`}
                    key={match.id}
                  >
                    {index === 0 && (
                      <span className="absolute right-0 top-0 bg-[#00FF66] px-2 py-0.5 text-[8px] font-black uppercase text-[#07140c]">
                        Featured Match
                      </span>
                    )}
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#60a5fa] text-xs font-black text-white shadow-md">
                      {initials}
                    </div>
                    <div className="mt-5 flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-white truncate max-w-[140px]">@{creator}</h3>
                        <p className="mt-1 text-[9px] font-semibold uppercase text-[#696e78]">
                          {platform} • {match.format || "1v1 • 10m"}
                        </p>
                      </div>
                      <span className="rounded bg-white/5 p-1.5 text-[#00FF66]">
                        <Icon name="controller" size={16} />
                      </span>
                    </div>
                    <div className="mt-6 grid grid-cols-2 border-y border-[#2a2d32] py-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#60656f]">Entry Stake</p>
                        <p className="mt-1 text-base font-black text-white">₦{stake}</p>
                      </div>
                      <div className="border-l border-[#2a2d32] pl-4">
                        <p className="text-[8px] uppercase tracking-wider text-[#60656f]">Prize Pool</p>
                        <p className="mt-1 text-base font-black text-[#00FF66]">₦{pool}</p>
                      </div>
                    </div>
                    <Button className="mt-4 h-10 w-full text-[10px] font-bold" href={`/match/${match.id}`}>
                      Accept Challenge →
                    </Button>
                  </article>
                );
              })
            )}

            {/* Platform Stats Card */}
            <article className="relative overflow-hidden rounded-lg border border-[#2b2e34] bg-[#101416] p-6 flex flex-col justify-between">
              <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-[#00FF66]/10 blur-3xl pointer-events-none" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#737a75]">Verified Community Pool</p>
                <p className="mt-4 text-3xl sm:text-4xl lg:text-[40px] font-black tracking-[-0.05em] text-[#00FF66]">
                  ₦24,820,000+
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#747a84]">Escrow Disbursed to Players</p>
              </div>
              <div className="mt-8">
                <div className="flex items-end gap-1 h-14">
                  {[28, 45, 35, 62, 48, 80, 66, 94, 75, 100].map((height, index) => (
                    <span
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        index > 6 ? "bg-[#00FF66]" : "bg-[#252b27]"
                      }`}
                      key={index}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-[8px] uppercase font-bold text-[#555a64]">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                  <span className="text-[#00FF66]">Today</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* How It Works */}
        <section className="grid grid-cols-1 lg:grid-cols-[.85fr_1.15fr] gap-12 border-y border-[#292c32] py-16" id="how-it-works">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">The staking loop</p>
            <h2 className="mt-3 max-w-[410px] text-4xl sm:text-5xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-white">Three moves. One winner.</h2>
            <p className="mt-5 max-w-[420px] text-sm leading-6 text-[#7f848e]">No complicated brackets. Create or accept a challenge, play your match, and let verified results settle the prize.</p>
            <Button className="mt-7 h-11 px-5 text-xs" href="/dashboard" variant="secondary">Read the match rules</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ["01", "Lock the stake", "Choose your amount and rules. Both stakes are secured before kickoff.", "stake"],
              ["02", "Play your match", "Connect on your platform and play under the agreed match format.", "controller"],
              ["03", "Claim the pool", "Submit the result. Once verified, the winner is paid instantly.", "bolt"],
            ].map(([number, title, copy, icon]) => (
              <article className="group rounded-lg border border-[#2a2d33] bg-[#121418] p-5 transition hover:border-[#00FF66]/40" key={number}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#00FF66]">{number}</span>
                  <div className="flex size-9 items-center justify-center rounded bg-[#00FF66]/10 text-[#00FF66]">
                    <Icon name={icon as IconName} size={18} />
                  </div>
                </div>
                <h3 className="mt-12 text-base font-black text-white">{title}</h3>
                <p className="mt-3 text-[11px] leading-5 text-[#6f747e]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Leaderboards */}
        <section className="py-16" id="leaderboards">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Season 08 leaders</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Players to beat</h2>
            </div>
            <p className="text-right text-[10px] leading-4 text-[#656a74]">Rankings update after every<br />verified match result.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {loadingLeaderboard ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <article key={idx} className="relative rounded-lg border border-[#26282f] bg-[#121418] p-5 text-center animate-pulse">
                  <div className="mx-auto size-14 rounded-full bg-[#20232b]" />
                  <div className="mt-4 mx-auto h-4 w-24 rounded bg-[#20232b]" />
                  <div className="mt-2 mx-auto h-3 w-16 rounded bg-[#181a20]" />
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#20232a] pt-4">
                    <div className="h-4 w-10 mx-auto rounded bg-[#20232b]" />
                    <div className="h-4 w-12 mx-auto rounded bg-[#20232b]" />
                  </div>
                </article>
              ))
            ) : leaderboard.length === 0 ? (
              <div className="col-span-full rounded-lg border border-[#2b2e35] bg-[#121418] p-8 text-center text-xs text-[#737883]">
                Season rankings are compiling. Complete a verified match to secure your spot!
              </div>
            ) : (
              leaderboard.slice(0, 5).map((player, index) => {
                const rankNum = String(index + 1).padStart(2, "0");
                const username = player.username || "Player";
                const initials = username.substring(0, 2).toUpperCase();
                const platform = player.platform || "PS5";
                const winRate = `${player.winRate || 0}%`;
                const earned = `₦${Number(player.winnings || player.wallet?.availableBalance || 0).toLocaleString()}`;

                return (
                  <article
                    className={`relative rounded-lg border p-5 text-center transition hover:border-[#00FF66]/40 ${
                      index === 0
                        ? "border-[#00FF66]/50 bg-[#142019] shadow-[0_0_20px_rgba(0,255,102,0.08)]"
                        : "border-[#292c32] bg-[#121418]"
                    }`}
                    key={player.id || username}
                  >
                    <span className="absolute left-3 top-3 text-2xl font-black text-white/[0.06]">{rankNum}</span>
                    <div
                      className={`mx-auto flex size-14 items-center justify-center rounded-full bg-[#282c33] text-xs font-black ${
                        index === 0 ? "ring-2 ring-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]" : "text-white"
                      }`}
                    >
                      {initials}
                    </div>
                    <h3 className="mt-4 text-sm font-black text-white truncate">@{username}</h3>
                    <p className="mt-1 text-[9px] text-[#686d77] uppercase">{platform} • Division 1</p>
                    <div className="mt-5 flex justify-center gap-5 border-t border-[#292c32] pt-4">
                      <div>
                        <p className="text-xs font-black text-[#00FF66]">{winRate}</p>
                        <p className="text-[7px] uppercase text-[#5d626c]">Win Rate</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{earned}</p>
                        <p className="text-[7px] uppercase text-[#5d626c]">Earned</p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Stories & Updates */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_.7fr] gap-4 border-t border-[#292c32] py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <article className="group relative min-h-64 rounded-lg overflow-hidden border border-[#2a2d33] bg-[#14161a] p-6">
              <div className="absolute right-0 top-0 h-full w-2/5 bg-[linear-gradient(135deg,transparent,#00FF6618)]" />
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#00FF66]">Player story</p>
              <h3 className="mt-16 max-w-[260px] text-2xl font-black leading-tight text-white">How GoalGhost climbed 214 places in one week.</h3>
              <button className="mt-5 text-[9px] font-black uppercase tracking-[0.14em] text-[#00FF66] hover:underline" type="button">Read the breakdown →</button>
            </article>
            <article className="group relative min-h-64 rounded-lg overflow-hidden border border-[#2a2d33] bg-[#14161a] p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#00FF66]">Product update</p>
              <div className="absolute right-8 top-7 flex size-16 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/5 text-[#00FF66]">
                <Icon name="shield" size={28} />
              </div>
              <h3 className="mt-16 max-w-[290px] text-2xl font-black leading-tight text-white">Faster disputes. Clearer match evidence.</h3>
              <button className="mt-5 text-[9px] font-black uppercase tracking-[0.14em] text-[#00FF66] hover:underline" type="button">See what changed →</button>
            </article>
          </div>
          <div className="rounded-lg border border-[#2a2d33] bg-[#101216] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#00FF66]">The weekly edge</p>
            <h3 className="mt-4 text-2xl font-black text-white">Know the lobby before you enter it.</h3>
            <p className="mt-3 text-xs leading-5 text-[#737883]">Rank movements, tournament drops, and the week’s biggest open stakes—one email, no noise.</p>
            <div className="mt-8 flex h-12 rounded-lg overflow-hidden border border-[#30333a] bg-[#0b0d10]">
              <input className="min-w-0 flex-1 bg-transparent px-4 text-xs text-white outline-none placeholder:text-[#51555f]" placeholder="you@email.com" type="email" />
              <button className="flex w-12 items-center justify-center bg-[#00FF66] text-[#07140c]" type="button">
                <Icon name="arrow" size={17} />
              </button>
            </div>
            <p className="mt-3 text-[8px] text-[#515660]">No spam. Unsubscribe whenever the streak ends.</p>
          </div>
        </section>

        {/* Paystack Merchant & Business Compliance Section */}
        <section className="border-t border-[#292c32] py-16">
          <div className="rounded-2xl border border-[#2b2f38] bg-gradient-to-b from-[#121419] to-[#0a0b0e] p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-[#22252c]">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex size-2 rounded-full bg-[#00FF66]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF66]">
                    Licensed Software &amp; Esports Tournament Platform
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Transparent, Skill-Based Competitive Gaming
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-[#8b919e]">
                  efChamps operates exclusively as a peer-to-peer esports tournament facilitation platform for eFootball™ players. Matches are 100% skill-based competitions where outcomes depend solely on participant ability, dexterity, and tactical football play. efChamps does not host games of chance or casino gambling.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-[#2a2e37] bg-[#16181f] px-4 py-3 text-center min-w-[130px]">
                  <p className="text-[9px] uppercase tracking-wider text-[#737883]">Payment Partner</p>
                  <p className="mt-0.5 text-xs font-black text-[#00C3F8]">Paystack Secured</p>
                </div>
                <div className="rounded-xl border border-[#2a2e37] bg-[#16181f] px-4 py-3 text-center min-w-[130px]">
                  <p className="text-[9px] uppercase tracking-wider text-[#737883]">Escrow Guarantee</p>
                  <p className="mt-0.5 text-xs font-black text-[#00FF66]">100% Locked</p>
                </div>
                <div className="rounded-xl border border-[#2a2e37] bg-[#16181f] px-4 py-3 text-center min-w-[130px]">
                  <p className="text-[9px] uppercase tracking-wider text-[#737883]">Payout Speed</p>
                  <p className="mt-0.5 text-xs font-black text-white">Instant Transfer</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Icon name="shield" size={16} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Automated Wallet Escrow</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-[#737883]">
                  All match stakes are held in automated cryptographic escrow before kickoff. Funds cannot be seized or withdrawn until results are confirmed or independently verified by arbiters.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Icon name="wallet" size={16} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Transparent Fees &amp; Minimums</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-[#737883]">
                  Standard platform commission is capped at 10% per prize pool to support servers, live arbitrament, and tournament operations. Minimum deposit is fixed at ₦1,000 via official Paystack checkout.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Icon name="headset" size={16} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Customer Support &amp; Arbitration</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-[#737883]">
                  Dedicated live human arbitration resolves any disputed match score within minutes through tamper-proof screenshot validation. Contact us 24/7 at <span className="text-white font-mono">support@efchamps.com</span>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#292c32] bg-[#090a0c] px-6 py-12">
        <div className="mx-auto flex flex-col md:flex-row max-w-[1280px] items-start justify-between gap-10">
          <div>
            <Brand />
            <p className="mt-4 max-w-[260px] text-[10px] leading-4 text-[#5f646e]">Competitive eFootball staking for players who back their game.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-14 text-[10px]">
            <div>
              <p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Platform</p>
              <div className="space-y-2 text-[#646973]">
                <Link className="block hover:text-white" href="/dashboard">Live lobby</Link>
                <Link className="block hover:text-white" href="/dashboard">Leaderboards</Link>
                <Link className="block hover:text-white" href="/dashboard">Tournaments</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Player care</p>
              <div className="space-y-2 text-[#646973]">
                <Link className="block hover:text-white" href="/dashboard">Help center</Link>
                <Link className="block hover:text-white" href="/dashboard">Responsible play</Link>
                <Link className="block hover:text-white" href="/dashboard">Disputes</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Legal</p>
              <div className="space-y-2 text-[#646973]">
                <Link className="block hover:text-[#00FF66] transition" href="/terms">Terms &amp; Conditions</Link>
                <Link className="block hover:text-[#00FF66] transition" href="/privacy">Privacy Policy</Link>
                <Link className="block hover:text-white" href="/terms#rules">Fair Play Rules</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Staff &amp; Access</p>
              <div className="space-y-2 text-[#646973]">
                <Link className="block hover:text-[#00FF66]" href="/admin">Admin Console</Link>
                <Link className="block hover:text-white" href="/login">Player Login</Link>
                <Link className="block hover:text-white" href="/register">Registration</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-[1280px] flex-col sm:flex-row justify-between gap-4 border-t border-[#23262b] pt-5 text-[8px] uppercase tracking-[0.12em] text-[#494e57]">
          <span>© 2026 efChamps. All rights reserved.</span>
          <span>Controller photography: Federico Vitale / Unsplash</span>
        </div>
      </footer>
    </div>
  );
}
