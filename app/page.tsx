import Link from "next/link";
import { Brand, Button, Icon, type IconName } from "./components/ui";

export default function HomePage() {
  const openMatches = [
    { player: "RicoNXT", rank: "#128", platform: "PS5", stake: "₦5,000", pool: "₦9,000", initials: "RN", tone: "from-[#2643a2] to-[#69a7ff]" },
    { player: "KairoFC", rank: "#084", platform: "Xbox", stake: "₦10,000", pool: "₦18,000", initials: "KF", tone: "from-[#7b2dcb] to-[#d47aff]" },
    { player: "GoalGhost", rank: "#031", platform: "PC", stake: "₦20,000", pool: "₦36,000", initials: "GG", tone: "from-[#067456] to-[#35d3a1]" },
  ];

  const topPlayers = [
    ["01", "Mendoza10", "PS5", "94%", "₦1,840,000", "MD"],
    ["02", "GoalGhost", "PC", "91%", "₦1,515,000", "GG"],
    ["03", "KairoFC", "Xbox", "89%", "₦1,280,000", "KF"],
    ["04", "RicoNXT", "PS5", "87%", "₦1,042,000", "RN"],
    ["05", "VantaXI", "Mobile", "86%", "₦910,000", "VX"],
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0C0D10] text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute right-[-180px] top-20 size-[760px] rounded-full bg-[#00FF66]/[0.055] blur-[150px]" />

      {/* Navigation Header */}
      <header className="relative z-20 mx-auto max-w-[1280px] px-6 mt-8 flex h-20 items-center justify-between border-b border-white/[0.07]">
        <Brand />
        <nav className="hidden md:flex items-center gap-9 text-[11px] font-bold uppercase tracking-[0.11em] text-[#8d929d]">
          <a className="border-b-2 border-[#00FF66] py-7 text-white" href="#home">Home</a>
          <a className="transition hover:text-white" href="#lobby">Live Lobby</a>
          <a className="transition hover:text-white" href="#leaderboards">Rankings</a>
          <a className="transition hover:text-white" href="#how-it-works">How it works</a>
          <Link className="transition hover:text-[#00FF66]" href="/admin">Admin Console</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button className="px-3 py-2 text-sm" href="/login" variant="ghost">Login</Button>
          <Button className="h-11 px-6 text-sm" href="/register">Sign Up</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-6">
        {/* Hero Section */}
        <section className="grid min-h-[580px] grid-cols-1 lg:grid-cols-[48%_52%] items-center py-12" id="home">
          <div className="relative z-10">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#00FF66]">The pitch is open // Season 08</p>
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black uppercase leading-[0.9] tracking-[-0.065em] text-white">
              Own the match.
              <span className="mt-3 block text-[#00FF66]">Take the pot.</span>
            </h1>
            <p className="mt-8 max-w-[500px] text-base leading-7 text-[#969ba6]">
              Put real stakes behind your eFootball skill. Challenge verified players, settle results securely, and let every goal mean more.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button className="h-14 px-8 text-sm" href="/dashboard">
                Enter the live lobby <Icon name="arrow" size={18} />
              </Button>
              <Button className="h-14 px-6 text-sm" href="#how-it-works" variant="secondary">
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
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Open now</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Featured stakes</h2>
            </div>
            <Link className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#00FF66] hover:underline" href="/dashboard">
              View all 12 challenges <Icon name="arrow" size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {openMatches.map((match, index) => (
              <article className={`relative overflow-hidden border bg-[#131519] p-5 rounded-lg ${index === 0 ? "border-[#00FF66]" : "border-[#2b2e34]"}`} key={match.player}>
                {index === 0 && <span className="absolute right-0 top-0 bg-[#00FF66] px-2 py-1 text-[8px] font-black uppercase text-[#07140c]">Hot match</span>}
                <div className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${match.tone} text-xs font-black`}>{match.initials}</div>
                <div className="mt-5 flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-white">{match.player}</h3>
                    <p className="mt-1 text-[9px] font-semibold uppercase text-[#696e78]">{match.platform} • Rank {match.rank}</p>
                  </div>
                  <Icon name="controller" size={17} />
                </div>
                <div className="mt-6 grid grid-cols-2 border-y border-[#2a2d32] py-4">
                  <div>
                    <p className="text-[8px] uppercase text-[#60656f]">Entry</p>
                    <p className="mt-1 text-lg font-black text-white">{match.stake}</p>
                  </div>
                  <div className="border-l border-[#2a2d32] pl-4">
                    <p className="text-[8px] uppercase text-[#60656f]">Prize pool</p>
                    <p className="mt-1 text-lg font-black text-[#00FF66]">{match.pool}</p>
                  </div>
                </div>
                <Button className="mt-4 h-10 w-full text-[10px]" href="/dashboard">Accept challenge</Button>
              </article>
            ))}
            <article className="relative overflow-hidden rounded-lg border border-[#2b2e34] bg-[#101416] p-6">
              <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-[#00FF66]/10 blur-3xl" />
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#737a75]">Community prize pool</p>
              <p className="mt-5 text-4xl lg:text-5xl font-black tracking-[-0.06em] text-[#00FF66]">₦24,820,000</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#747a84]">Paid to winners this week</p>
              <div className="mt-8 flex items-end gap-1">
                {[28, 45, 35, 62, 48, 80, 66, 94, 75, 100].map((height, index) => (
                  <span className={`w-full ${index > 6 ? "bg-[#00FF66]" : "bg-[#29312c]"}`} key={index} style={{ height }} />
                ))}
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
            {topPlayers.map((player, index) => (
              <article className={`relative rounded-lg border p-5 text-center ${index === 0 ? "border-[#00FF66]/50 bg-[#142019]" : "border-[#292c32] bg-[#121418]"}`} key={player[1]}>
                <span className="absolute left-3 top-3 text-2xl font-black text-white/[0.06]">{player[0]}</span>
                <div className={`mx-auto flex size-14 items-center justify-center rounded-full bg-[#282c33] text-xs font-black ${index === 0 ? "ring-2 ring-[#00FF66]" : ""}`}>{player[5]}</div>
                <h3 className="mt-4 text-sm font-black text-white">{player[1]}</h3>
                <p className="mt-1 text-[9px] text-[#686d77]">{player[2]} • Division 1</p>
                <div className="mt-5 flex justify-center gap-5 border-t border-[#292c32] pt-4">
                  <div>
                    <p className="text-xs font-black text-[#00FF66]">{player[3]}</p>
                    <p className="text-[7px] uppercase text-[#5d626c]">Wins</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{player[4]}</p>
                    <p className="text-[7px] uppercase text-[#5d626c]">Earned</p>
                  </div>
                </div>
              </article>
            ))}
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#292c32] bg-[#090a0c] px-6 py-12">
        <div className="mx-auto flex flex-col md:flex-row max-w-[1280px] items-start justify-between gap-10">
          <div>
            <Brand />
            <p className="mt-4 max-w-[260px] text-[10px] leading-4 text-[#5f646e]">Competitive eFootball staking for players who back their game.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20 text-[10px]">
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
              <p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Staff</p>
              <div className="space-y-2 text-[#646973]">
                <Link className="block hover:text-[#00FF66]" href="/admin">Admin Console</Link>
                <Link className="block hover:text-white" href="/login">Player Login</Link>
                <Link className="block hover:text-white" href="/register">Registration</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-[1280px] flex-col sm:flex-row justify-between gap-4 border-t border-[#23262b] pt-5 text-[8px] uppercase tracking-[0.12em] text-[#494e57]">
          <span>© 2026 GoalVault. All rights reserved.</span>
          <span>Controller photography: Federico Vitale / Unsplash</span>
        </div>
      </footer>
    </div>
  );
}
