import { useState, type ReactNode } from "react";

type IconName =
  | "arrow"
  | "bolt"
  | "check"
  | "chevron"
  | "controller"
  | "crown"
  | "gamepad"
  | "grid"
  | "headset"
  | "leaderboard"
  | "lock"
  | "mobile"
  | "plus"
  | "shield"
  | "stake"
  | "wallet";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    controller: (
      <>
        <path d="M8 11h4m-2-2v4m5-1h.01M18 10h.01" />
        <path d="M7 6h10a5 5 0 0 1 4.7 6.7l-1.4 3.8a2 2 0 0 1-3.4.6L15 15H9l-1.9 2.1a2 2 0 0 1-3.4-.6l-1.4-3.8A5 5 0 0 1 7 6Z" />
      </>
    ),
    crown: <path d="m3 7 4 3 5-6 5 6 4-3-2 11H5L3 7Zm2 14h14" />,
    gamepad: (
      <>
        <path d="M8 11h4m-2-2v4m5-1h.01M18 10h.01" />
        <path d="M7 6h10a5 5 0 0 1 4.7 6.7l-1.4 3.8a2 2 0 0 1-3.4.6L15 15H9l-1.9 2.1a2 2 0 0 1-3.4-.6l-1.4-3.8A5 5 0 0 1 7 6Z" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    headset: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M18 19c0 1-1 2-3 2h-2m-7-7H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2v-5Zm12 5h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-2v5Z" />
      </>
    ),
    leaderboard: (
      <>
        <path d="M8 21V11h8v10M3 21v-6h5m8 6V7h5v14" />
        <path d="M5 9h3m4-6 1 2 2 .3-1.5 1.5.4 2.2L12 8l-1.9 1 .4-2.2L9 5.3l2-.3 1-2Z" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
      </>
    ),
    mobile: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    stake: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5c-.6-.7-1.8-1.2-3.2-1.2-1.8 0-3.3.9-3.3 2.3s1.3 2 3.3 2.4c2 .4 3.3 1 3.3 2.5 0 1.4-1.5 2.3-3.4 2.3-1.5 0-2.8-.5-3.6-1.4M12 5v14" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12" />
        <path d="M16 11h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {paths[name]}
      </g>
    </svg>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 items-center justify-center text-[#00FF66]">
        <svg aria-label="GoalVault logo" fill="none" height="40" viewBox="0 0 40 40" width="40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2 35 10v17L20 38 5 27V10L20 2Z" fill="#00FF66" fillOpacity=".08" stroke="#00FF66" strokeWidth="1.5" />
          <path d="M11 25V13h18v12M15 25v-8h10v8" stroke="#00FF66" strokeLinecap="square" strokeWidth="2" />
          <circle cx="20" cy="24" fill="#0C0D10" r="5" stroke="#00FF66" strokeWidth="1.5" />
          <path d="m20 19 3 2-1 3h-4l-1-3 3-2Zm-2 5-2 3m6-3 2 3" stroke="#00FF66" strokeWidth="1" />
        </svg>
      </div>
      {!compact && (
        <div className="font-black tracking-[-0.045em] text-white">
          GOAL<span className="text-[#00FF66]">VAULT</span>
          <span className="mt-0.5 block text-[6px] font-bold tracking-[0.28em] text-[#626771]">PLAY • PROVE • COLLECT</span>
        </div>
      )}
    </div>
  );
}

function Button({
  children,
  className = "",
  variant = "primary",
  onClick,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:
      "bg-[#00FF66] text-[#06150c] shadow-[0_0_30px_rgba(0,255,102,.13)] hover:bg-[#4dff93] hover:shadow-[0_0_36px_rgba(0,255,102,.25)]",
    secondary:
      "border border-[#2b2e35] bg-[#17191e] text-white hover:border-[#00FF66]/50 hover:text-[#00FF66]",
    ghost: "text-[#969ba6] hover:bg-white/5 hover:text-white",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 active:translate-y-px ${variants[variant]} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">{label}</span>
      <input
        className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-white outline-none transition placeholder:text-[#51555e] focus:border-[#00FF66] focus:ring-2 focus:ring-[#00FF66]/10"
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function SelectField() {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Platform</span>
      <div className="relative">
        <select
          className="h-13 w-full appearance-none rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none transition focus:border-[#00FF66] focus:ring-2 focus:ring-[#00FF66]/10"
          defaultValue=""
        >
          <option disabled value="">Select your platform</option>
          <option>PS5</option>
          <option>Xbox</option>
          <option>PC</option>
          <option>Mobile</option>
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#747984]">
          <Icon name="chevron" size={17} />
        </span>
      </div>
    </label>
  );
}

function FrameLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="absolute left-8 top-7 z-20 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5d626c]">
      <span className="text-[#00FF66]">{number}</span>
      <span className="h-px w-7 bg-[#34373d]" />
      {title}
    </div>
  );
}

function LandingFrame() {
  const openMatches = [
    { player: "RicoNXT", rank: "#128", platform: "PS5", stake: "$10", pool: "$18", initials: "RN", tone: "from-[#2643a2] to-[#69a7ff]" },
    { player: "KairoFC", rank: "#084", platform: "Xbox", stake: "$25", pool: "$45", initials: "KF", tone: "from-[#7b2dcb] to-[#d47aff]" },
    { player: "GoalGhost", rank: "#031", platform: "PC", stake: "$50", pool: "$90", initials: "GG", tone: "from-[#067456] to-[#35d3a1]" },
  ];
  const topPlayers = [
    ["01", "Mendoza10", "PS5", "94%", "$2,840", "MD"],
    ["02", "GoalGhost", "PC", "91%", "$2,315", "GG"],
    ["03", "KairoFC", "Xbox", "89%", "$1,980", "KF"],
    ["04", "RicoNXT", "PS5", "87%", "$1,642", "RN"],
    ["05", "VantaXI", "Mobile", "86%", "$1,410", "VX"],
  ];

  return (
    <section className="landing-frame frame relative w-[1440px] shrink-0 overflow-hidden bg-[#0C0D10]">
      <FrameLabel number="01" title="Landing Page" />
      <div className="pointer-events-none absolute right-[-180px] top-20 size-[760px] rounded-full bg-[#00FF66]/[0.055] blur-[150px]" />
      <header className="relative z-20 mx-16 mt-18 flex h-18 items-center justify-between border-b border-white/[0.07]">
        <Brand />
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-9 text-[11px] font-bold uppercase tracking-[0.11em] text-[#8d929d]">
          <a className="border-b border-[#00FF66] py-7 text-white" href="#home">Home</a>
          <a className="transition hover:text-white" href="#lobby">Live Lobby</a>
          <a className="transition hover:text-white" href="#leaderboards">Rankings</a>
          <a className="transition hover:text-white" href="#how-it-works">How it works</a>
        </nav>
        <div className="flex items-center gap-5">
          <Button className="px-2 py-3 text-sm" variant="ghost">Login</Button>
          <Button className="h-11 px-6 text-sm">Sign Up</Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1280px]">
        <section className="grid min-h-[560px] grid-cols-[47%_53%] items-center">
          <div className="relative z-10 pl-4">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#00FF66]">The pitch is open // Season 08</p>
            <h1 className="text-[76px] font-black uppercase leading-[0.86] tracking-[-0.065em] text-white">
              Own the match.
              <span className="mt-3 block text-[#00FF66]">Take the pot.</span>
            </h1>
            <p className="mt-8 max-w-[500px] text-base leading-7 text-[#969ba6]">
              Put real stakes behind your eFootball skill. Challenge verified players, settle results securely, and let every goal mean more.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Button className="h-14 px-8 text-sm">Enter the live lobby <Icon name="arrow" size={18} /></Button>
              <Button className="h-14 px-6 text-sm" variant="secondary"><Icon name="controller" size={18} /> See how it works</Button>
            </div>
            <div className="mt-9 flex items-center gap-8">
              {["PS5", "XBOX", "PC", "MOBILE"].map((platform) => (
                <span className="text-[10px] font-black tracking-[0.18em] text-[#5e636d]" key={platform}>{platform}</span>
              ))}
            </div>
          </div>
          <div className="relative h-[540px] overflow-hidden">
            <div className="absolute inset-10 rotate-[-6deg] border border-[#00FF66]/25 [clip-path:polygon(20%_0,100%_15%,88%_100%,0_84%)]" />
            <div className="absolute inset-16 rotate-[7deg] border border-[#00FF66]/10 [clip-path:polygon(20%_0,100%_15%,88%_100%,0_84%)]" />
            <img
              alt="Black game controller in dramatic light"
              className="absolute inset-0 size-full scale-110 object-cover object-center mix-blend-lighten"
              src="https://images.unsplash.com/photo-1543328011-1c0d628fae09?auto=format&fit=crop&w=1200&q=90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#0C0D10_0%,transparent_35%,transparent_75%,#0C0D10_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,#0C0D10_0%,transparent_38%)]" />
            <div className="absolute bottom-16 right-6 border-l-2 border-[#00FF66] bg-black/60 px-5 py-3 backdrop-blur-md">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#00FF66]">Live challenges</p>
              <p className="mt-1 text-2xl font-black text-white">147</p>
            </div>
          </div>
        </section>

        <section className="relative grid grid-cols-[1fr_auto_auto_auto] items-center border border-[#00FF66]/25 bg-[#101315] px-7 py-6 [clip-path:polygon(0_0,98.5%_0,100%_28%,100%_100%,1.5%_100%,0_72%)]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Next community event</p>
            <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.03em] text-white">Weekend winner-takes-all <span className="text-[#00FF66]">Cup</span></h2>
          </div>
          <div className="mr-12 flex gap-8">
            {[["01", "Days"], ["09", "Hrs"], ["42", "Mins"], ["18", "Secs"]].map(([value, label]) => (
              <div className="text-center" key={label}><p className="text-3xl font-black text-white">{value}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[0.15em] text-[#676c77]">{label}</p></div>
            ))}
          </div>
          <div className="mr-10 h-12 w-px bg-[#2e3338]" />
          <Button className="h-11 px-5 text-xs" variant="secondary">View event rules <Icon name="arrow" size={15} /></Button>
        </section>

        <section className="py-16" id="lobby">
          <div className="mb-7 flex items-end justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Open now</p><h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Featured stakes</h2></div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#00FF66]" type="button">View all 12 challenges <Icon name="arrow" size={15} /></button>
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr_1.25fr] gap-4">
            {openMatches.map((match, index) => (
              <article className={`relative overflow-hidden border bg-[#131519] p-5 ${index === 0 ? "border-[#00FF66]" : "border-[#2b2e34]"}`} key={match.player}>
                {index === 0 && <span className="absolute right-0 top-0 bg-[#00FF66] px-2 py-1 text-[8px] font-black uppercase text-[#07140c]">Hot match</span>}
                <div className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${match.tone} text-xs font-black`}>{match.initials}</div>
                <div className="mt-5 flex items-start justify-between"><div><h3 className="font-black text-white">{match.player}</h3><p className="mt-1 text-[9px] font-semibold uppercase text-[#696e78]">{match.platform} • Rank {match.rank}</p></div><Icon name="controller" size={17} /></div>
                <div className="mt-6 grid grid-cols-2 border-y border-[#2a2d32] py-4"><div><p className="text-[8px] uppercase text-[#60656f]">Entry</p><p className="mt-1 text-lg font-black text-white">{match.stake}</p></div><div className="border-l border-[#2a2d32] pl-4"><p className="text-[8px] uppercase text-[#60656f]">Prize pool</p><p className="mt-1 text-lg font-black text-[#00FF66]">{match.pool}</p></div></div>
                <Button className="mt-4 h-10 w-full text-[10px]">Accept challenge</Button>
              </article>
            ))}
            <article className="relative overflow-hidden border border-[#2b2e34] bg-[#101416] p-6">
              <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-[#00FF66]/10 blur-3xl" />
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#737a75]">Community prize pool</p>
              <p className="mt-5 text-5xl font-black tracking-[-0.06em] text-[#00FF66]">$24,820</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#747a84]">Paid to winners this week</p>
              <div className="mt-8 flex items-end gap-1">
                {[28, 45, 35, 62, 48, 80, 66, 94, 75, 100].map((height, index) => <span className={`w-full ${index > 6 ? "bg-[#00FF66]" : "bg-[#29312c]"}`} key={index} style={{ height }} />)}
              </div>
            </article>
          </div>
        </section>

        <section className="grid grid-cols-[.85fr_1.15fr] gap-12 border-y border-[#292c32] py-15" id="how-it-works">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">The staking loop</p>
            <h2 className="mt-3 max-w-[410px] text-5xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-white">Three moves. One winner.</h2>
            <p className="mt-5 max-w-[420px] text-sm leading-6 text-[#7f848e]">No complicated brackets. Create or accept a challenge, play your match, and let verified results settle the prize.</p>
            <Button className="mt-7 h-11 px-5 text-xs" variant="secondary">Read the match rules</Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["01", "Lock the stake", "Choose your amount and rules. Both stakes are secured before kickoff.", "stake"],
              ["02", "Play your match", "Connect on your platform and play under the agreed match format.", "controller"],
              ["03", "Claim the pool", "Submit the result. Once verified, the winner is paid instantly.", "bolt"],
            ].map(([number, title, copy, icon]) => (
              <article className="group border border-[#2a2d33] bg-[#121418] p-5 transition hover:border-[#00FF66]/40" key={number}>
                <div className="flex items-center justify-between"><span className="text-[10px] font-black text-[#00FF66]">{number}</span><div className="flex size-9 items-center justify-center bg-[#00FF66]/10 text-[#00FF66]"><Icon name={icon as IconName} size={18} /></div></div>
                <h3 className="mt-14 text-base font-black text-white">{title}</h3><p className="mt-3 text-[11px] leading-5 text-[#6f747e]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16" id="leaderboards">
          <div className="mb-7 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Season 08 leaders</p><h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">Players to beat</h2></div><p className="text-right text-[10px] leading-4 text-[#656a74]">Rankings update after every<br />verified match result.</p></div>
          <div className="grid grid-cols-5 gap-3">
            {topPlayers.map((player, index) => (
              <article className={`relative border p-5 text-center ${index === 0 ? "border-[#00FF66]/50 bg-[#142019]" : "border-[#292c32] bg-[#121418]"}`} key={player[1]}>
                <span className="absolute left-3 top-3 text-2xl font-black text-white/[0.06]">{player[0]}</span>
                <div className={`mx-auto flex size-14 items-center justify-center rounded-full bg-[#282c33] text-xs font-black ${index === 0 ? "ring-2 ring-[#00FF66]" : ""}`}>{player[5]}</div>
                <h3 className="mt-4 text-sm font-black text-white">{player[1]}</h3><p className="mt-1 text-[9px] text-[#686d77]">{player[2]} • Division 1</p>
                <div className="mt-5 flex justify-center gap-5 border-t border-[#292c32] pt-4"><div><p className="text-xs font-black text-[#00FF66]">{player[3]}</p><p className="text-[7px] uppercase text-[#5d626c]">Wins</p></div><div><p className="text-xs font-black text-white">{player[4]}</p><p className="text-[7px] uppercase text-[#5d626c]">Earned</p></div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-[1.3fr_.7fr] gap-4 border-t border-[#292c32] py-16">
          <div className="grid grid-cols-2 gap-4">
            <article className="group relative min-h-64 overflow-hidden border border-[#2a2d33] bg-[#14161a] p-6">
              <div className="absolute right-0 top-0 h-full w-2/5 bg-[linear-gradient(135deg,transparent,#00FF6618)]" />
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#00FF66]">Player story</p><h3 className="mt-20 max-w-[260px] text-2xl font-black leading-tight text-white">How GoalGhost climbed 214 places in one week.</h3><button className="mt-5 text-[9px] font-black uppercase tracking-[0.14em] text-[#00FF66]" type="button">Read the breakdown →</button>
            </article>
            <article className="group relative min-h-64 overflow-hidden border border-[#2a2d33] bg-[#14161a] p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#00FF66]">Product update</p><div className="absolute right-8 top-7 flex size-18 items-center justify-center border border-[#00FF66]/20 bg-[#00FF66]/5 text-[#00FF66]"><Icon name="shield" size={30} /></div><h3 className="mt-20 max-w-[290px] text-2xl font-black leading-tight text-white">Faster disputes. Clearer match evidence.</h3><button className="mt-5 text-[9px] font-black uppercase tracking-[0.14em] text-[#00FF66]" type="button">See what changed →</button>
            </article>
          </div>
          <div className="border border-[#2a2d33] bg-[#101216] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#00FF66]">The weekly edge</p><h3 className="mt-4 text-2xl font-black text-white">Know the lobby before you enter it.</h3><p className="mt-3 text-xs leading-5 text-[#737883]">Rank movements, tournament drops, and the week’s biggest open stakes—one email, no noise.</p>
            <div className="mt-8 flex h-12 border border-[#30333a] bg-[#0b0d10]"><input className="min-w-0 flex-1 bg-transparent px-4 text-xs text-white outline-none placeholder:text-[#51555f]" placeholder="you@email.com" type="email" /><button className="flex w-12 items-center justify-center bg-[#00FF66] text-[#07140c]" type="button"><Icon name="arrow" size={17} /></button></div>
            <p className="mt-3 text-[8px] text-[#515660]">No spam. Unsubscribe whenever the streak ends.</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#292c32] bg-[#090a0c] px-20 py-10">
        <div className="mx-auto flex max-w-[1280px] items-start justify-between">
          <div><Brand /><p className="mt-4 max-w-[260px] text-[10px] leading-4 text-[#5f646e]">Competitive eFootball staking for players who back their game.</p></div>
          <div className="grid grid-cols-3 gap-20 text-[10px]">
            <div><p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Platform</p><div className="space-y-2 text-[#646973]"><p>Live lobby</p><p>Leaderboards</p><p>Match rules</p></div></div>
            <div><p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Player care</p><div className="space-y-2 text-[#646973]"><p>Help center</p><p>Responsible play</p><p>Disputes</p></div></div>
            <div><p className="mb-4 font-black uppercase tracking-[0.14em] text-white">Legal</p><div className="space-y-2 text-[#646973]"><p>Terms</p><p>Privacy</p><p>Eligibility</p></div></div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-[1280px] justify-between border-t border-[#23262b] pt-5 text-[8px] uppercase tracking-[0.12em] text-[#494e57]"><span>© 2026 GoalVault. All rights reserved.</span><span>Controller photography: Federico Vitale / Unsplash</span></div>
      </footer>
    </section>
  );
}

function AuthFrame({ mode }: { mode: "login" | "register" }) {
  const [notice, setNotice] = useState("");
  const isLogin = mode === "login";

  function submit(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  return (
    <section className="frame relative w-[1440px] shrink-0 overflow-hidden bg-[#0C0D10]">
      <FrameLabel number={isLogin ? "02" : "03"} title={isLogin ? "Secure Login" : "Player Registration"} />
      <div className={`grid h-full ${isLogin ? "grid-cols-[58%_42%]" : "grid-cols-[42%_58%]"}`}>
        <div className={`relative overflow-hidden border-[#282b30] bg-[#101216] ${isLogin ? "order-1 border-r" : "order-2 border-l"}`}>
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,255,102,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="absolute -right-20 top-24 size-120 rounded-full border border-[#00FF66]/10" />
          <div className="absolute -right-2 top-42 size-80 rounded-full border border-[#00FF66]/15" />
          <div className="relative flex h-full flex-col justify-between p-20 pt-28">
            <Brand />
            <div className="max-w-[600px]">
              <p className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#00FF66]">
                {isLogin ? "Player clearance // 04" : "Build your player identity"}
              </p>
              <h2 className="text-[64px] font-black leading-[0.95] tracking-[-0.055em] text-white">
                {isLogin ? <>Your next win is <span className="text-[#00FF66]">waiting.</span></> : <>One identity. <span className="text-[#00FF66]">Every arena.</span></>}
              </h2>
              <p className="mt-7 max-w-[490px] text-base leading-7 text-[#858b96]">
                {isLogin
                  ? "Return to your live stakes, match history, and secure balance. The lobby moves fast."
                  : "Your rank, reputation, wallet, and match record travel with you across every supported platform."}
              </p>
            </div>
            <div className="flex items-center justify-between border border-[#29302c] bg-[#0d110f]/80 px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center bg-[#00FF66]/10 text-[#00FF66]"><Icon name={isLogin ? "shield" : "stake"} size={17} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white">{isLogin ? "Secure session ready" : "First stake protected"}</p>
                  <p className="mt-1 text-[9px] text-[#666d69]">{isLogin ? "Your wallet remains locked until you sign in." : "New players receive guided match verification."}</p>
                </div>
              </div>
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#00FF66]"><span className="size-1.5 rounded-full bg-[#00FF66]" /> Active</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#2a2d32] border-y border-[#2a2d32]">
              {[
                ["12.4K", "verified players"],
                ["4.9/5", "player rating"],
                ["24/7", "match support"],
              ].map(([value, label]) => (
                <div className="flex min-h-20 flex-col items-center justify-center px-4 py-5 text-center" key={label}>
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="mt-1.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.1em] text-[#5f646e]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`relative flex items-center justify-center bg-[#0C0D10] px-20 pt-12 ${isLogin ? "order-2" : "order-1"}`}>
          <div className="absolute right-10 top-9 text-[10px] text-[#666b75]">
            {isLogin ? "New to GoalVault?" : "Already registered?"}
            <button className="ml-2 font-bold text-[#00FF66] hover:text-white" type="button">{isLogin ? "Create account" : "Sign in"}</button>
          </div>
          <div className="w-full max-w-[430px]">
            <div className="mb-9">
              <div className="mb-5 flex size-12 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]">
                <Icon name={isLogin ? "lock" : "controller"} size={22} />
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#00FF66]">{isLogin ? "Welcome back" : "$5 first-match credit"}</p>
              <h2 className="text-[42px] font-black tracking-[-0.04em] text-white">{isLogin ? "Sign in" : "Create account"}</h2>
              <p className="mt-3 text-sm text-[#7d828d]">{isLogin ? "Enter your credentials to resume." : "Start your competitive record."}</p>
            </div>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); submit(isLogin ? "Secure login initiated" : "Account registration started"); }}>
              {isLogin ? (
                <>
                  <Field label="Username or Email" placeholder="Enter your username or email" />
                  <Field label="Password" placeholder="Enter your password" type="password" />
                  <div className="flex items-center justify-between py-1 text-xs">
                    <label className="flex items-center gap-2 text-[#858a95]">
                      <input className="size-4 accent-[#00FF66]" type="checkbox" /> Remember me
                    </label>
                    <button className="font-semibold text-[#00FF66] hover:text-white" type="button">Forgot password?</button>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Desired Username" placeholder="Choose your gamertag" />
                  <Field label="Email Address" placeholder="player@example.com" type="email" />
                  <div>
                    <Field label="Password" placeholder="Create a secure password" type="password" />
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1 flex-1 rounded-full bg-[#00FF66]" />
                      <span className="h-1 flex-1 rounded-full bg-[#00FF66]/35" />
                      <span className="h-1 flex-1 rounded-full bg-[#282b30]" />
                      <span className="ml-2 text-[8px] font-bold uppercase tracking-[0.1em] text-[#6e756f]">8+ characters</span>
                    </div>
                  </div>
                  <SelectField />
                  <label className="flex gap-3 pt-1 text-xs leading-5 text-[#6f747e]">
                    <input className="mt-0.5 size-4 shrink-0 accent-[#00FF66]" type="checkbox" />
                    I’m 18+ and agree to the Terms of Play and responsible gaming policy.
                  </label>
                </>
              )}
              <Button className="h-13 w-full text-sm" type="submit">
                {isLogin ? <><Icon name="shield" size={18} /> Secure Login</> : <>Register &amp; Claim Bonus <Icon name="arrow" size={18} /></>}
              </Button>
            </form>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#26292f]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#555a64]">256-bit protected session</span>
              <span className="h-px flex-1 bg-[#26292f]" />
            </div>
            {isLogin && (
              <div className="mt-6">
                <p className="mb-3 text-center text-[9px] font-bold uppercase tracking-[0.13em] text-[#555a64]">Quick platform access</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-11 text-[10px]" variant="secondary"><Icon name="controller" size={16} /> Continue with PSN</Button>
                  <Button className="h-11 text-[10px]" variant="secondary"><Icon name="controller" size={16} /> Continue with Xbox</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {notice && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[#00FF66]/30 bg-[#151a17] px-5 py-3 text-xs font-semibold text-[#00FF66] shadow-xl">
          <Icon name="check" size={16} /> {notice}
        </div>
      )}
    </section>
  );
}

const matches = [
  { name: "RicoNXT", rank: "#128", platform: "PS5", stake: 10, prize: 18, format: "1v1 • 8 min", tone: "from-[#1d4ed8] to-[#60a5fa]", initials: "RN" },
  { name: "KairoFC", rank: "#084", platform: "Xbox", stake: 25, prize: 45, format: "1v1 • 10 min", tone: "from-[#7c3aed] to-[#c084fc]", initials: "KF" },
  { name: "DrePrime", rank: "#242", platform: "Mobile", stake: 5, prize: 9, format: "1v1 • 6 min", tone: "from-[#c2410c] to-[#fb923c]", initials: "DP" },
  { name: "GoalGhost", rank: "#031", platform: "PC", stake: 50, prize: 90, format: "1v1 • 10 min", tone: "from-[#047857] to-[#34d399]", initials: "GG" },
  { name: "VantaXI", rank: "#177", platform: "PS5", stake: 15, prize: 27, format: "1v1 • 8 min", tone: "from-[#be123c] to-[#fb7185]", initials: "VX" },
  { name: "AxelPro", rank: "#109", platform: "Xbox", stake: 10, prize: 18, format: "1v1 • 8 min", tone: "from-[#a16207] to-[#facc15]", initials: "AP" },
];

function MatchCard({ match }: { match: (typeof matches)[number] }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <article className="group rounded-lg border border-[#292c32] bg-[#14161a] p-5 transition hover:-translate-y-0.5 hover:border-[#00FF66]/35 hover:shadow-[0_18px_40px_rgba(0,0,0,.3)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex size-11 items-center justify-center rounded-full bg-gradient-to-br ${match.tone} text-xs font-black text-white ring-2 ring-[#292c32]`}>
            {match.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{match.name}</h3>
              <span className="size-1.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
            </div>
            <p className="mt-1 text-[10px] font-semibold text-[#676c77]">DIVISION 2 • {match.rank}</p>
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
          <p className="mt-1 text-lg font-black text-white">${match.stake}<span className="ml-1 text-[10px] font-medium text-[#666b74]">USD</span></p>
        </div>
        <div className="h-8 w-px bg-[#292c31]" />
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#5f646e]">Prize pool</p>
          <p className="mt-1 text-lg font-black text-[#00FF66]">${match.prize}<span className="ml-1 text-[10px] font-medium text-[#567060]">USD</span></p>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between text-[10px] font-semibold text-[#6d727d]">
        <span>{match.format}</span>
        <span>Standard teams</span>
      </div>
      <Button
        className="h-11 w-full text-xs"
        onClick={() => setAccepted(!accepted)}
        variant={accepted ? "secondary" : "primary"}
      >
        {accepted ? <><Icon name="check" size={16} /> Challenge Accepted</> : <>Accept Challenge <Icon name="arrow" size={16} /></>}
      </Button>
    </article>
  );
}

type DashboardView = "Match Lobby" | "My Active Stakes" | "Tournaments" | "Secure Wallet" | "Leaderboard" | "Support" | "Profile";

function ViewHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex items-end justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00FF66]">{eyebrow}</span>
        </div>
        <h1 className="text-3xl font-black tracking-[-0.035em] text-white">{title}</h1>
        <p className="mt-2 text-xs text-[#737883]">{copy}</p>
      </div>
      {action}
    </div>
  );
}

function LobbyView() {
  return (
    <>
      <ViewHeading
        copy="Pick your opponent. Back your skill. Take the prize."
        eyebrow="12 open now"
        title="Match lobby"
        action={
          <div className="flex gap-2">
            {["All platforms", "Stake amount", "Newest"].map((filter, index) => (
              <Button className="h-9 px-3 text-[10px]" key={filter} variant="secondary">
                {filter} {index < 2 && <Icon name="chevron" size={14} />}
              </Button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-3 gap-4">
        {matches.map((match) => <MatchCard key={match.name} match={match} />)}
      </div>
    </>
  );
}

function ActiveStakesView() {
  const stakes = [
    { opponent: "KairoFC", platform: "Xbox", stake: "$25.00", prize: "$45.00", state: "Awaiting result", score: "—", time: "Started 12m ago", initials: "KF", tone: "from-[#7c3aed] to-[#c084fc]" },
    { opponent: "VantaXI", platform: "PS5", stake: "$15.00", prize: "$27.00", state: "Opponent joined", score: "0 – 0", time: "Kickoff in 04:22", initials: "VX", tone: "from-[#be123c] to-[#fb7185]" },
  ];
  return (
    <>
      <ViewHeading copy="Live stakes stay locked until both players verify the result." eyebrow="2 matches in play" title="Active stakes" action={<Button className="h-10 px-4 text-xs" variant="secondary">Match rules</Button>} />
      <div className="grid grid-cols-3 gap-4">
        {[
          ["$40.00", "capital in play", "stake"],
          ["$72.00", "potential return", "bolt"],
          ["84%", "30-day win rate", "crown"],
        ].map(([value, label, icon]) => (
          <div className="flex items-center gap-4 rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name={icon as IconName} /></div>
            <div><p className="text-xl font-black text-white">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#666b75]">{label}</p></div>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {stakes.map((stake, index) => (
          <article className="relative overflow-hidden rounded-lg border border-[#2b2e34] bg-[#14161a]" key={stake.opponent}>
            <div className="absolute inset-y-0 left-0 w-1 bg-[#00FF66]" />
            <div className="grid grid-cols-[1.4fr_.8fr_.8fr_1fr_auto] items-center gap-6 p-6">
              <div className="flex items-center gap-4">
                <div className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${stake.tone} text-xs font-black`}>{stake.initials}</div>
                <div><p className="text-[10px] uppercase tracking-[0.12em] text-[#626772]">You vs</p><h3 className="mt-1 font-bold text-white">{stake.opponent}</h3><p className="mt-1 text-[10px] text-[#626772]">{stake.platform} • Division 2</p></div>
              </div>
              <div><p className="text-[9px] uppercase tracking-[0.13em] text-[#5e636e]">Your stake</p><p className="mt-2 text-lg font-black text-white">{stake.stake}</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.13em] text-[#5e636e]">Prize pool</p><p className="mt-2 text-lg font-black text-[#00FF66]">{stake.prize}</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.13em] text-[#5e636e]">{stake.state}</p><p className="mt-2 text-2xl font-black text-white">{stake.score}</p><p className="mt-1 text-[10px] text-[#747984]">{stake.time}</p></div>
              <Button className="h-10 px-4 text-xs" variant={index === 0 ? "primary" : "secondary"}>{index === 0 ? "Submit result" : "Open match room"}</Button>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-dashed border-[#30343b] p-6 text-center">
        <p className="text-xs font-bold text-[#8b909a]">No other stakes in progress</p>
        <p className="mt-1 text-[10px] text-[#565b65]">Finished matches move to your performance history automatically.</p>
      </div>
    </>
  );
}

function WalletView({ openModal }: { openModal: (modal: ModalType) => void }) {
  const transactions = [
    ["Match win • RicoNXT", "Today, 14:42", "+$18.00", "text-[#00FF66]"],
    ["Stake locked • KairoFC", "Today, 14:06", "−$25.00", "text-white"],
    ["Wallet deposit", "Yesterday, 19:20", "+$50.00", "text-[#00FF66]"],
    ["Match stake • AxelPro", "Yesterday, 16:11", "−$10.00", "text-white"],
  ];
  return (
    <>
      <ViewHeading copy="Your money, movement, and limits in one secure place." eyebrow="Wallet protected" title="Secure wallet" action={<div className="flex gap-2"><Button className="h-10 px-4 text-xs" onClick={() => openModal("withdraw")} variant="secondary">Withdraw</Button><Button className="h-10 px-4 text-xs" onClick={() => openModal("funds")}><Icon name="plus" size={15} /> Add funds</Button></div>} />
      <div className="grid grid-cols-[1.35fr_.65fr] gap-5">
        <div className="relative overflow-hidden rounded-lg border border-[#00FF66]/25 bg-[#121914] p-7">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[#00FF66]/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6f8476]">Available balance</p><p className="mt-3 text-5xl font-black tracking-[-0.05em] text-white">$45.00</p><p className="mt-2 text-xs text-[#708077]">USD • Available instantly</p></div><div className="flex size-11 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]"><Icon name="wallet" /></div></div>
            <div className="mt-10 flex gap-8 border-t border-[#29352d] pt-5"><div><p className="text-[9px] uppercase text-[#607067]">Locked in stakes</p><p className="mt-1 font-bold text-white">$40.00</p></div><div><p className="text-[9px] uppercase text-[#607067]">Lifetime winnings</p><p className="mt-1 font-bold text-[#00FF66]">$684.50</p></div><div><p className="text-[9px] uppercase text-[#607067]">Wallet ID</p><p className="mt-1 font-mono text-xs text-white">•••• 8024</p></div></div>
          </div>
        </div>
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6">
          <p className="text-xs font-bold text-white">Monthly play limit</p>
          <p className="mt-2 text-[10px] leading-4 text-[#686d77]">You’ve used $145 of your $300 responsible play limit.</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#25282d]"><div className="h-full w-[48%] rounded-full bg-[#00FF66]" /></div>
          <div className="mt-3 flex justify-between text-[10px]"><span className="text-[#00FF66]">$145 used</span><span className="text-[#666b75]">$155 remaining</span></div>
          <Button className="mt-6 h-10 w-full text-xs" variant="secondary">Manage limits</Button>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="flex items-center justify-between border-b border-[#292c32] px-6 py-4"><h3 className="text-sm font-bold text-white">Recent activity</h3><button className="text-[10px] font-bold text-[#00FF66]" type="button">View all transactions</button></div>
        {transactions.map(([title, date, amount, tone]) => (
          <div className="grid grid-cols-[1fr_160px_100px] items-center border-b border-[#25282d] px-6 py-4 last:border-b-0" key={title}>
            <div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-md bg-white/[0.04] text-[#8c919b]"><Icon name="stake" size={15} /></div><p className="text-xs font-semibold text-white">{title}</p></div>
            <p className="text-[10px] text-[#646973]">{date}</p><p className={`text-right text-xs font-black ${tone}`}>{amount}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function LeaderboardView() {
  const leaders = [
    ["01", "Mendoza10", "PS5", "94%", "$2,840", "MD"],
    ["02", "GoalGhost", "PC", "91%", "$2,315", "GG"],
    ["03", "KairoFC", "Xbox", "89%", "$1,980", "KF"],
    ["04", "RicoNXT", "PS5", "87%", "$1,642", "RN"],
    ["128", "Mavrick_J", "Xbox", "84%", "$684", "MJ"],
  ];
  return (
    <>
      <ViewHeading copy="The sharpest players this season, ranked by verified performance." eyebrow="Season 08 • Week 3" title="Global leaderboard" action={<Button className="h-10 px-4 text-xs" variant="secondary">All platforms <Icon name="chevron" size={14} /></Button>} />
      <div className="grid grid-cols-3 gap-4">
        {[leaders[1], leaders[0], leaders[2]].map((player, index) => (
          <div className={`relative overflow-hidden rounded-lg border p-6 text-center ${index === 1 ? "border-[#00FF66]/35 bg-[#152019]" : "mt-5 border-[#292c32] bg-[#14161a]"}`} key={player[1]}>
            <div className="absolute left-4 top-4 text-3xl font-black text-white/[0.06]">{player[0]}</div>
            <div className={`mx-auto flex size-15 items-center justify-center rounded-full bg-gradient-to-br from-[#30343b] to-[#626a76] text-sm font-black text-white ${index === 1 ? "ring-2 ring-[#00FF66]" : ""}`}>{player[5]}</div>
            <p className="mt-4 font-bold text-white">{player[1]}</p><p className="mt-1 text-[10px] text-[#6b707a]">{player[2]} • Division 1</p>
            <div className="mt-5 flex justify-center gap-7 border-t border-[#2a2d32] pt-4"><div><p className="text-sm font-black text-[#00FF66]">{player[3]}</p><p className="text-[8px] uppercase text-[#60656f]">Win rate</p></div><div><p className="text-sm font-black text-white">{player[4]}</p><p className="text-[8px] uppercase text-[#60656f]">Won</p></div></div>
          </div>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="grid grid-cols-[70px_1fr_120px_120px_130px] bg-[#17191d] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#5f646e]"><span>Rank</span><span>Player</span><span>Platform</span><span>Win rate</span><span className="text-right">Total won</span></div>
        {leaders.map((player) => (
          <div className={`grid grid-cols-[70px_1fr_120px_120px_130px] items-center border-t border-[#26292e] px-6 py-3.5 ${player[1] === "Mavrick_J" ? "bg-[#00FF66]/[0.06]" : ""}`} key={player[1]}>
            <span className={`text-xs font-black ${player[1] === "Mavrick_J" ? "text-[#00FF66]" : "text-[#727782]"}`}>#{player[0]}</span>
            <div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#2b2f36] text-[9px] font-black">{player[5]}</div><span className="text-xs font-bold text-white">{player[1]} {player[1] === "Mavrick_J" && <span className="ml-2 text-[8px] text-[#00FF66]">YOU</span>}</span></div>
            <span className="text-xs text-[#7b808a]">{player[2]}</span><span className="text-xs font-bold text-white">{player[3]}</span><span className="text-right text-xs font-bold text-white">{player[4]}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SupportView() {
  return (
    <>
      <ViewHeading copy="Fast answers for match, wallet, and account questions." eyebrow="Average response • 4 min" title="Player support" />
      <div className="grid grid-cols-[1.15fr_.85fr] gap-5">
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-7">
          <div className="flex size-11 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="headset" /></div>
          <h3 className="mt-6 text-2xl font-black text-white">What can we solve?</h3><p className="mt-2 text-xs text-[#747984]">Search the playbook or start a priority conversation.</p>
          <div className="mt-6 flex h-13 items-center rounded-lg border border-[#34373e] bg-[#0e1013] px-4 focus-within:border-[#00FF66]"><Icon name="grid" size={17} /><input className="h-full flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-[#555a64]" placeholder="Search match rules, withdrawals, disputes..." /></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {["Report a match result", "Payment & withdrawals", "Account security", "Fair play & disputes"].map((topic) => <button className="rounded-lg border border-[#2a2d33] bg-[#101216] p-4 text-left text-xs font-semibold text-[#a2a7b0] transition hover:border-[#00FF66]/40 hover:text-white" key={topic} type="button">{topic}<span className="mt-3 block text-[#00FF66]">Explore →</span></button>)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#00FF66]/25 bg-[#121914] p-6"><div className="flex items-center gap-2 text-[#00FF66]"><span className="size-2 rounded-full bg-[#00FF66]" /><span className="text-[10px] font-bold uppercase tracking-[0.15em]">Agents online</span></div><h3 className="mt-5 text-xl font-black text-white">Talk to a match specialist</h3><p className="mt-2 text-xs leading-5 text-[#717a74]">Get help from someone who understands stakes, result verification, and platform rules.</p><Button className="mt-6 h-11 w-full text-xs">Start live chat</Button></div>
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6"><p className="text-xs font-bold text-white">Your open ticket</p><div className="mt-4 flex items-center justify-between rounded-lg bg-[#0e1013] p-4"><div><p className="text-xs font-semibold text-white">#SX-2048 • Result review</p><p className="mt-1 text-[10px] text-[#636872]">Updated 8 minutes ago</p></div><span className="rounded bg-[#f59e0b]/10 px-2 py-1 text-[9px] font-bold text-[#f59e0b]">IN REVIEW</span></div></div>
        </div>
      </div>
    </>
  );
}

function ProfileView() {
  return (
    <>
      <ViewHeading copy="Your public competitive identity and private account controls." eyebrow="Verified player" title="Player profile" action={<Button className="h-10 px-4 text-xs">Save changes</Button>} />
      <div className="grid grid-cols-[330px_1fr] gap-5">
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-7 text-center">
          <div className="relative mx-auto w-fit"><div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-2xl font-black ring-4 ring-[#22262b]">MJ</div><span className="absolute bottom-1 right-1 size-5 rounded-full border-4 border-[#14161a] bg-[#00FF66]" /></div>
          <h3 className="mt-5 text-xl font-black text-white">Mavrick_J</h3><p className="mt-1 text-xs text-[#737883]">Konami ID • MAV8024</p><div className="mx-auto mt-4 w-fit rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#00FF66]">Identity verified</div>
          <div className="mt-7 grid grid-cols-3 border-y border-[#292c32] py-4"><div><p className="font-black text-white">128</p><p className="text-[8px] uppercase text-[#5f646e]">Global</p></div><div><p className="font-black text-white">84%</p><p className="text-[8px] uppercase text-[#5f646e]">Win rate</p></div><div><p className="font-black text-white">62</p><p className="text-[8px] uppercase text-[#5f646e]">Matches</p></div></div>
          <Button className="mt-6 h-10 w-full text-xs" variant="secondary">Change avatar</Button>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6"><h3 className="text-sm font-bold text-white">Player details</h3><div className="mt-5 grid grid-cols-2 gap-4"><Field label="Gamertag" placeholder="Mavrick_J" /><Field label="Email address" placeholder="mavrick@example.com" /><Field label="Konami eFootball ID" placeholder="MAV8024" /><SelectField /></div></div>
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-6"><h3 className="text-sm font-bold text-white">Competitive preferences</h3><div className="mt-5 grid grid-cols-3 gap-3">{["Open to challenges", "Match reminders", "Public match history"].map((setting) => <label className="flex items-center justify-between rounded-lg border border-[#2b2e34] bg-[#101216] p-4 text-[10px] font-semibold text-[#9ba0aa]" key={setting}>{setting}<input className="accent-[#00FF66]" defaultChecked type="checkbox" /></label>)}</div></div>
        </div>
      </div>
    </>
  );
}

type ModalType = "challenge" | "funds" | "withdraw";

function ActionModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  const [complete, setComplete] = useState(false);
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
      title: "Add funds",
      copy: "Top up your playable balance through a protected payment channel.",
      icon: "plus" as IconName,
      action: "Add $25.00",
      success: "Funds added",
      successCopy: "$25.00 has been credited to your available GoalVault balance.",
    },
    withdraw: {
      eyebrow: "Wallet withdrawal",
      title: "Withdraw winnings",
      copy: "Move available funds from your GoalVault wallet to your verified account.",
      icon: "wallet" as IconName,
      action: "Withdraw $25.00",
      success: "Withdrawal requested",
      successCopy: "Your request is being processed and usually arrives within one business day.",
    },
  }[type];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-10 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="relative w-full max-w-[540px] overflow-hidden rounded-lg border border-[#34383e] bg-[#121418] shadow-[0_30px_100px_rgba(0,0,0,.8)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="h-1 w-full bg-[#00FF66]" />
        <button aria-label="Close modal" className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-md border border-[#30343a] text-lg text-[#777c86] transition hover:border-[#00FF66] hover:text-white" onClick={onClose} type="button">×</button>
        {!complete ? (
          <>
            <div className="border-b border-[#292c32] px-7 pb-6 pt-7">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name={details.icon} size={19} /></div>
              <p className="mt-5 text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">{details.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-white">{details.title}</h2>
              <p className="mt-2 text-xs leading-5 text-[#747984]">{details.copy}</p>
            </div>
            <form className="space-y-4 p-7" onSubmit={(event) => { event.preventDefault(); setComplete(true); }}>
              {type === "challenge" && (
                <>
                  <div className="grid grid-cols-2 gap-4"><SelectField /><Field label="Entry Stake" placeholder="$10.00" /></div>
                  <div className="grid grid-cols-2 gap-4"><Field label="Match Time" placeholder="10 minutes" /><Field label="Team Rules" placeholder="Standard teams" /></div>
                  <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Challenge visibility</span><select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>Public lobby</option><option>Invite only</option></select></label>
                  <div className="flex items-start gap-3 rounded-lg border border-[#29332d] bg-[#101612] p-4"><Icon name="lock" size={17} /><p className="text-[10px] leading-4 text-[#738078]">$10.00 will move from your available balance into secure escrow when this challenge is published.</p></div>
                </>
              )}
              {type === "funds" && (
                <>
                  <Field label="Deposit Amount" placeholder="$25.00" />
                  <div className="grid grid-cols-4 gap-2">{["$10", "$25", "$50", "$100"].map((amount) => <button className={`h-9 rounded-lg border text-[10px] font-bold ${amount === "$25" ? "border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]" : "border-[#2d3036] text-[#7c818b]"}`} key={amount} type="button">{amount}</button>)}</div>
                  <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Payment method</span><select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>Visa ending in 4821</option><option>Add new payment method</option></select></label>
                  <div className="flex justify-between border-y border-[#292c32] py-4 text-xs"><span className="text-[#717680]">You pay</span><span className="font-black text-white">$25.00 USD</span></div>
                </>
              )}
              {type === "withdraw" && (
                <>
                  <div className="rounded-lg border border-[#29332d] bg-[#101612] p-4"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#68736c]">Available to withdraw</p><p className="mt-2 text-2xl font-black text-white">$45.00 <span className="text-[10px] text-[#687069]">USD</span></p></div>
                  <Field label="Withdrawal Amount" placeholder="$25.00" />
                  <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Destination</span><select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>Verified bank •••• 8024</option><option>PayPal • mavrick@example.com</option></select></label>
                  <div className="grid grid-cols-2 gap-4 border-y border-[#292c32] py-4 text-[10px]"><div><p className="text-[#656a74]">Processing fee</p><p className="mt-1 font-bold text-white">$0.00</p></div><div><p className="text-[#656a74]">Estimated arrival</p><p className="mt-1 font-bold text-white">Within 1 business day</p></div></div>
                </>
              )}
              <div className="flex gap-3 pt-1"><Button className="h-12 flex-1 text-xs" onClick={onClose} variant="secondary">Cancel</Button><Button className="h-12 flex-[1.7] text-xs" type="submit">{details.action} <Icon name="arrow" size={16} /></Button></div>
            </form>
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

function DashboardFrame() {
  const [activeView, setActiveView] = useState<DashboardView>("Match Lobby");
  const [modal, setModal] = useState<ModalType | null>(null);
  const sidebar = [
    { icon: "grid" as IconName, label: "Match Lobby", active: true, badge: "12" },
    { icon: "stake" as IconName, label: "My Active Stakes", badge: "2" },
    { icon: "crown" as IconName, label: "Tournaments", badge: "5/8" },
    { icon: "wallet" as IconName, label: "Secure Wallet" },
    { icon: "leaderboard" as IconName, label: "Leaderboard" },
    { icon: "headset" as IconName, label: "Support" },
  ];

  return (
    <section className="frame relative flex w-[1440px] shrink-0 overflow-hidden bg-[#0C0D10]">
      <FrameLabel number="04" title="Interactive Product Dashboard" />
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#282b31] bg-[#101115] px-5 pb-7 pt-20">
        <div className="px-3">
          <Brand />
        </div>
        <div className="mt-12 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#4f545e]">Competition</div>
        <nav className="mt-3 space-y-1.5">
          {sidebar.map((item) => (
            <button
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-xs font-semibold transition ${
                activeView === item.label ? "bg-[#00FF66]/10 text-[#00FF66]" : "text-[#858a95] hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => setActiveView(item.label as DashboardView)}
              key={item.label}
              type="button"
            >
              <Icon name={item.icon} size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] ${activeView === item.label ? "bg-[#00FF66] text-[#07140c]" : "bg-[#272a30] text-[#9196a0]"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-[#29302c] bg-gradient-to-br from-[#18221b] to-[#121512] p-4">
          <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-[#00FF66]/10 text-[#00FF66]">
            <Icon name="shield" size={17} />
          </div>
          <p className="text-xs font-bold text-white">Stay in control</p>
          <p className="mt-1.5 text-[10px] leading-4 text-[#737a76]">Set limits and play responsibly.</p>
          <button className="mt-3 text-[10px] font-bold text-[#00FF66]" type="button">View controls →</button>
        </div>
        <button className="mt-5 flex items-center gap-3 border-t border-[#25282e] px-2 pt-5 text-left" onClick={() => setActiveView("Profile")} type="button">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-[10px] font-black text-white">MJ</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">Mavrick_J</p>
            <p className="text-[9px] text-[#626771]">Verified player</p>
          </div>
          <Icon name="chevron" size={15} />
        </button>
      </aside>

      <div className="min-w-0 flex-1 pt-14">
        <header className="flex h-19 items-center justify-between border-b border-[#282b31] bg-[#0e0f12] px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5f646e]">Welcome back</p>
            <h2 className="mt-1 text-sm font-bold text-white">Mavrick_J <span className="ml-1 text-[#00FF66]">• Online</span></h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 items-center rounded-lg border border-[#292c32] bg-[#15171b] pl-4">
              <div className="pr-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#5e636d]">Balance</p>
                <p className="mt-0.5 text-xs font-bold text-white">$45.00 <span className="font-medium text-[#686d77]">USD</span></p>
              </div>
              <button className="flex h-full w-10 items-center justify-center rounded-r-lg border-l border-[#292c32] text-[#00FF66] transition hover:bg-[#00FF66]/10" type="button">
                <Icon name="plus" size={17} />
              </button>
            </div>
            <Button className="h-11 px-5 text-xs" onClick={() => setModal("challenge")}>
              <Icon name="plus" size={17} /> Create Challenge
            </Button>
          </div>
        </header>

        <main className="px-8 py-7">
          {activeView === "Match Lobby" && <LobbyView />}
          {activeView === "My Active Stakes" && <ActiveStakesView />}
          {activeView === "Tournaments" && <TournamentView />}
          {activeView === "Secure Wallet" && <WalletView openModal={setModal} />}
          {activeView === "Leaderboard" && <LeaderboardView />}
          {activeView === "Support" && <SupportView />}
          {activeView === "Profile" && <ProfileView />}
        </main>
      </div>
      {modal && <ActionModal onClose={() => setModal(null)} type={modal} />}
    </section>
  );
}

function CreateTournamentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-10 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-lg border border-[#34383e] bg-[#121418] shadow-[0_30px_100px_rgba(0,0,0,.8)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="h-1 bg-[#00FF66]" />
        <button aria-label="Close modal" className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-md border border-[#30343a] text-lg text-[#777c86] hover:border-[#00FF66] hover:text-white" onClick={onClose} type="button">×</button>
        <div className="border-b border-[#292c32] px-7 pb-6 pt-7">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="crown" size={19} /></div>
          <p className="mt-5 text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">Tournament builder</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-white">Create a custom tournament</h2>
          <p className="mt-2 text-xs leading-5 text-[#747984]">Set the bracket, stake, and match rules. The lobby opens when you publish.</p>
        </div>
        <form className="space-y-4 p-7" onSubmit={(event) => { event.preventDefault(); onCreated(); }}>
          <Field label="Tournament Name" placeholder="e.g. Friday Night Knockout" />
          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Bracket size</span><select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>8 players</option><option>16 players</option><option>32 players</option></select></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Format</span><select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>Single elimination</option><option>Double elimination</option><option>Round robin</option></select></label>
          </div>
          <div className="grid grid-cols-2 gap-4"><Field label="Stake Per Player" placeholder="$10.00" /><SelectField /></div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">Game mode</span><select className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none focus:border-[#00FF66]"><option>Dream Team</option><option>Authentic Team</option></select></label>
            <Field label="Match Time" placeholder="10 minutes" />
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-[#29332d] bg-[#101612] p-4"><Icon name="lock" size={17} /><p className="text-[10px] leading-4 text-[#738078]">Your $10 host stake will be locked when the tournament is published. Player stakes remain protected in escrow.</p></div>
          <div className="flex gap-3 pt-1"><Button className="h-12 flex-1 text-xs" onClick={onClose} variant="secondary">Save draft</Button><Button className="h-12 flex-[1.6] text-xs" type="submit">Publish Tournament <Icon name="arrow" size={16} /></Button></div>
        </form>
      </div>
    </div>
  );
}

function TournamentView() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [filter, setFilter] = useState("Open");
  const tournaments = [
    { id: "108", name: "Custom Knockout #108", host: "Player_Alpha", size: "8 players", joined: 5, max: 8, stake: "$10", pool: "$80", mode: "Dream Team", platform: "Cross-play", state: "Open", accent: "from-[#143823] to-[#101713]" },
    { id: "042", name: "Weekend Winner Cup", host: "GoalVault", size: "32 players", joined: 29, max: 32, stake: "$20", pool: "$640", mode: "Dream Team", platform: "PS5", state: "Open", accent: "from-[#23365d] to-[#111722]" },
    { id: "019", name: "Mobile Kings", host: "DrePrime", size: "16 players", joined: 16, max: 16, stake: "$5", pool: "$80", mode: "Authentic", platform: "Mobile", state: "Live", accent: "from-[#512040] to-[#1d1119]" },
    { id: "007", name: "High Roller Eight", host: "Mendoza10", size: "8 players", joined: 7, max: 8, stake: "$100", pool: "$800", mode: "Dream Team", platform: "PC", state: "Open", accent: "from-[#4c3814] to-[#1b1710]" },
    { id: "221", name: "Xbox Night League", host: "KairoFC", size: "16 players", joined: 11, max: 16, stake: "$15", pool: "$240", mode: "Dream Team", platform: "Xbox", state: "Open", accent: "from-[#174233] to-[#101a16]" },
    { id: "164", name: "Zero Stake Warmup", host: "CoachMills", size: "8 players", joined: 8, max: 8, stake: "Free", pool: "Rank XP", mode: "Authentic", platform: "Cross-play", state: "Starting", accent: "from-[#333643] to-[#15161c]" },
  ];
  if (created) tournaments.unshift({ id: "NEW", name: "Friday Night Knockout", host: "Mavrick_J", size: "8 players", joined: 1, max: 8, stake: "$10", pool: "$80", mode: "Dream Team", platform: "Cross-play", state: "Open", accent: "from-[#17452a] to-[#101b15]" });

  if (selectedTournament) return <TournamentDetailView onBack={() => setSelectedTournament(null)} />;

  return (
    <div className="relative">
      <ViewHeading
        copy="Find an open bracket, follow live rounds, or host a tournament on your terms."
        eyebrow="7 tournaments available"
        title="Tournament arena"
        action={<Button className="h-11 px-5 text-xs" onClick={() => setCreating(true)}><Icon name="plus" size={16} /> Create Tournament</Button>}
      />
      <section className="relative mb-5 grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-lg border border-[#00FF66]/25 bg-gradient-to-r from-[#15251a] to-[#111512] px-7 py-5">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[#00FF66]/10 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="flex size-13 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]"><Icon name="crown" size={23} /></div>
          <div><div className="flex items-center gap-2"><span className="rounded bg-[#00FF66] px-2 py-0.5 text-[7px] font-black uppercase text-[#07140c]">Featured</span><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#748078]">Official GoalVault event</span></div><h2 className="mt-2 text-xl font-black text-white">Weekend Winner-Takes-All Cup</h2><p className="mt-1 text-[10px] text-[#778078]">32 players • $20 entry • $640 locked prize pool • Starts Saturday 20:00 UTC</p></div>
        </div>
        <Button className="relative h-10 px-5 text-[10px]" onClick={() => setSelectedTournament("042")} variant="secondary">View Tournament <Icon name="arrow" size={14} /></Button>
      </section>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-[#292c32] bg-[#121418] p-1">
          {["Open", "Live", "My Tournaments", "Completed"].map((tab) => <button className={`rounded-md px-4 py-2 text-[9px] font-bold transition ${filter === tab ? "bg-[#00FF66] text-[#07140c]" : "text-[#777c86] hover:text-white"}`} key={tab} onClick={() => setFilter(tab)} type="button">{tab}</button>)}
        </div>
        <div className="flex gap-2"><Button className="h-9 px-3 text-[9px]" variant="secondary">All platforms <Icon name="chevron" size={13} /></Button><Button className="h-9 px-3 text-[9px]" variant="secondary">Any stake <Icon name="chevron" size={13} /></Button></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tournaments.slice(0, 6).map((tournament) => {
          const percent = Math.round((tournament.joined / tournament.max) * 100);
          return (
            <article className="group overflow-hidden rounded-lg border border-[#292c32] bg-[#14161a] transition hover:-translate-y-0.5 hover:border-[#00FF66]/35" key={tournament.id}>
              <div className={`h-16 bg-gradient-to-r ${tournament.accent} px-5 py-4`}>
                <div className="flex items-start justify-between"><div><p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#00FF66]">Tournament #{tournament.id}</p><h3 className="mt-1 text-sm font-black text-white">{tournament.name}</h3></div><span className={`rounded px-2 py-1 text-[7px] font-black uppercase ${tournament.state === "Open" ? "bg-[#00FF66]/10 text-[#00FF66]" : "bg-white/[0.07] text-[#9ca1ab]"}`}>{tournament.state}</span></div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-[9px]"><span className="text-[#656a74]">Hosted by <b className="text-[#a4a9b2]">{tournament.host}</b></span><span className="font-bold text-[#8d929c]">{tournament.platform}</span></div>
                <div className="mt-4 grid grid-cols-3 border-y border-[#292c32] py-3"><div><p className="text-[7px] uppercase text-[#5d626c]">Entry</p><p className="mt-1 text-sm font-black text-white">{tournament.stake}</p></div><div className="border-l border-[#292c32] pl-3"><p className="text-[7px] uppercase text-[#5d626c]">Pool</p><p className="mt-1 text-sm font-black text-[#00FF66]">{tournament.pool}</p></div><div className="border-l border-[#292c32] pl-3"><p className="text-[7px] uppercase text-[#5d626c]">Format</p><p className="mt-1 text-[9px] font-bold text-white">{tournament.size}</p></div></div>
                <div className="mt-4"><div className="flex justify-between text-[8px]"><span className="text-[#686d77]">{tournament.joined}/{tournament.max} players joined</span><span className="font-bold text-[#00FF66]">{percent}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#272a2f]"><div className="h-full rounded-full bg-[#00FF66]" style={{ width: `${percent}%` }} /></div></div>
                <Button className="mt-4 h-9 w-full text-[9px]" onClick={() => setSelectedTournament(tournament.id)} variant={tournament.state === "Open" ? "primary" : "secondary"}>{tournament.state === "Open" ? "View & Join Tournament" : "View Live Bracket"} <Icon name="arrow" size={13} /></Button>
              </div>
            </article>
          );
        })}
      </div>
      {creating && <CreateTournamentModal onClose={() => setCreating(false)} onCreated={() => { setCreated(true); setCreating(false); }} />}
    </div>
  );
}

function TournamentDetailView({ onBack }: { onBack: () => void }) {
  const [joined, setJoined] = useState(false);
  const players = [
    { name: "Player_Alpha", id: "KON-8492-AX", team: "Manchester United", initials: "PA", tone: "from-[#164e63] to-[#22d3ee]" },
    { name: "RicoNXT", id: "KON-2104-RX", team: "FC Barcelona", initials: "RN", tone: "from-[#1e40af] to-[#60a5fa]" },
    { name: "KairoFC", id: "KON-7701-KF", team: "Bayern München", initials: "KF", tone: "from-[#6b21a8] to-[#c084fc]" },
    { name: "GoalGhost", id: "KON-3340-GG", team: "Arsenal FC", initials: "GG", tone: "from-[#065f46] to-[#34d399]" },
    { name: "VantaXI", id: "KON-9914-VX", team: "AC Milan", initials: "VX", tone: "from-[#9f1239] to-[#fb7185]" },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-[-80px] top-[-100px] size-[420px] rounded-full bg-[#00FF66]/[0.025] blur-[110px]" />
      <div className="relative">
        <section className="grid grid-cols-[1.05fr_1fr_.8fr] items-center border-b border-[#292c32] py-7">
          <div>
            <button className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#777c86] transition hover:text-[#00FF66]" onClick={onBack} type="button">← All tournaments</button>
            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#00FF66]">8-player custom tournament</p>
            <h1 className="mt-2 text-[30px] font-black tracking-[-0.045em] text-white">Custom Knockout Bracket #108</h1>
            <p className="mt-2 text-xs text-[#727782]">Hosted by: <span className="font-bold text-white">Player_Alpha</span></p>
          </div>
          <div className="mx-auto flex min-w-[410px] items-center rounded-lg border border-[#2d3430] bg-[#111713] px-5 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name="lock" size={19} /></div>
            <div className="ml-4 pr-6"><p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#68716b]">Stake per player</p><p className="mt-1 text-base font-black text-white">$10.00</p></div>
            <div className="h-9 w-px bg-[#303732]" />
            <div className="pl-6"><p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#68716b]">Total escrow pool locked</p><p className="mt-1 text-base font-black text-[#00FF66]">$80.00</p></div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-3 rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-4 py-2.5">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00FF66] opacity-60" /><span className="relative size-2 rounded-full bg-[#00FF66]" /></span>
              <span className="text-[10px] font-bold text-[#b8c1bb]">Waiting for Players ({joined ? "6" : "5"}/8 Joined)</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-[1fr_350px] gap-6 py-7">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#00FF66]">Player allocation</p><h2 className="mt-1.5 text-xl font-black text-white">Knockout slots</h2></div>
              <div className="flex items-center gap-4 text-[9px] text-[#646973]"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#00FF66]" /> Stake locked</span><span className="flex items-center gap-2"><span className="size-2 rounded-full border border-[#626771]" /> Open</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {players.map((player, index) => (
                <article className="relative flex min-h-[132px] items-center rounded-lg border border-[#2b2e34] bg-[#14161a] p-5" key={player.name}>
                  <span className="absolute right-4 top-3 text-3xl font-black text-white/[0.035]">0{index + 1}</span>
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${player.tone} text-xs font-black text-white ring-2 ring-[#2e3238]`}>{player.initials}</div>
                  <div className="ml-4 min-w-0">
                    <div className="flex items-center gap-2"><h3 className="truncate text-sm font-black text-white">{player.name}</h3>{index === 0 && <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] font-bold uppercase text-[#8d929c]">Host</span>}</div>
                    <p className="mt-1 text-[9px] font-mono text-[#626772]">{player.id}</p>
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold text-[#999ea8]"><Icon name="controller" size={13} /> {player.team}</div>
                  </div>
                  <div className="ml-auto self-end rounded-md bg-[#00FF66]/10 px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-[#00FF66]"><span className="mr-1">✓</span> Stake locked</div>
                </article>
              ))}
              {[6, 7].map((slot) => (
                <article className="group flex min-h-[132px] items-center justify-center rounded-lg border border-dashed border-[#34383f] bg-[#101216] transition hover:border-[#00FF66]/35" key={slot}>
                  <div className="text-center"><div className="mx-auto flex size-9 items-center justify-center rounded-full border border-[#34383f] text-[#696e78] group-hover:text-[#00FF66]"><Icon name="plus" size={16} /></div><p className="mt-3 text-xs font-bold text-[#686d77]">Open Slot</p><p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-[#444951]">Player 0{slot}</p></div>
                </article>
              ))}
              {joined ? (
                <article className="relative flex min-h-[132px] items-center rounded-lg border border-[#00FF66]/50 bg-[#121b15] p-5">
                  <span className="absolute right-4 top-3 text-3xl font-black text-[#00FF66]/[0.06]">08</span>
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-xs font-black ring-2 ring-[#00FF66]">MJ</div>
                  <div className="ml-4"><h3 className="text-sm font-black text-white">Mavrick_J</h3><p className="mt-1 text-[9px] font-mono text-[#626772]">KON-8024-MJ</p><p className="mt-3 text-[9px] font-semibold text-[#9da2ac]">Manchester City</p></div>
                  <div className="ml-auto self-end rounded-md bg-[#00FF66] px-2 py-1.5 text-[8px] font-black uppercase text-[#07140c]">✓ Stake locked</div>
                </article>
              ) : (
                <article className="relative flex min-h-[132px] items-center justify-center overflow-hidden rounded-lg border border-[#00FF66] bg-[#121b15] shadow-[0_0_35px_rgba(0,255,102,.1)]">
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,transparent_45%,rgba(0,255,102,.08)_45%,rgba(0,255,102,.08)_55%,transparent_55%)] [background-size:18px_18px]" />
                  <div className="relative text-center"><p className="mb-3 text-[8px] font-black uppercase tracking-[0.15em] text-[#7b8a80]">Final player slot</p><Button className="h-11 px-5 text-[10px]" onClick={() => setJoined(true)}>Join Tournament &amp; Lock $10</Button></div>
                </article>
              )}
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
                {[["Game Mode", "Dream Team"], ["Match Time", "10 mins"], ["Injuries", "Off"], ["Condition", "Normal"], ["Extra Time", "On"], ["Penalties", "On"]].map(([label, value]) => (
                  <div className="flex items-center justify-between border-b border-[#272a2f] py-3 last:border-b-0" key={label}><span className="text-[10px] text-[#686d77]">{label}</span><span className="text-[10px] font-bold text-white">{value}</span></div>
                ))}
              </div>
              <div className="mt-6 border-l-2 border-[#f59e0b] bg-[#f59e0b]/[0.06] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#f59e0b]">Forfeit warning</p>
                <p className="mt-2 text-[10px] leading-5 text-[#9a8b73]">Disconnections or failure to submit match scores within 30 minutes of round generation will result in a forfeit of your locked stake.</p>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#29332d] bg-[#101612] p-3"><Icon name="shield" size={16} /><p className="text-[9px] leading-4 text-[#6e7b72]">Escrow releases automatically after the final result is verified.</p></div>
            </div>
          </aside>
        </section>

        <div className="flex items-center justify-between border-t border-[#292c32] py-5">
          <p className="text-[9px] uppercase tracking-[0.12em] text-[#555a64]">Bracket generates automatically when all 8 stakes are locked.</p>
          <div className="flex items-center gap-4 text-[9px] font-bold text-[#777c86]"><span>Single elimination</span><span className="size-1 rounded-full bg-[#44484f]" /><span>3 rounds</span><span className="size-1 rounded-full bg-[#44484f]" /><span>Winner takes $72.00</span></div>
        </div>
      </div>
    </div>
  );
}

type AdminView = "Overview" | "Players" | "Matches" | "Disputes" | "Transactions" | "Tournaments" | "Risk & Limits" | "Settings";

const adminRows: Record<Exclude<AdminView, "Overview" | "Settings">, { headers: string[]; rows: string[][] }> = {
  Players: {
    headers: ["Player", "Status", "Platform", "Matches", "Wallet", "Action"],
    rows: [
      ["RicoNXT", "Verified", "PS5", "148", "$184.50", "Review"],
      ["KairoFC", "Verified", "Xbox", "221", "$92.00", "Review"],
      ["DrePrime", "KYC pending", "Mobile", "34", "$45.00", "Verify"],
      ["VantaXI", "Under review", "PS5", "96", "$0.00", "Inspect"],
      ["GoalGhost", "Verified", "PC", "302", "$416.20", "Review"],
    ],
  },
  Matches: {
    headers: ["Match ID", "Players", "Platform", "Stake", "State", "Action"],
    rows: [
      ["#MT-8842", "RicoNXT vs KairoFC", "Cross-play", "$25.00", "Live • 42'", "Monitor"],
      ["#MT-8841", "GoalGhost vs VantaXI", "PS5", "$50.00", "Result pending", "Inspect"],
      ["#MT-8839", "AxelPro vs DrePrime", "Xbox", "$10.00", "Completed", "Details"],
      ["#MT-8837", "NeoStriker vs Osei10", "Mobile", "$5.00", "Evidence review", "Inspect"],
      ["#MT-8834", "Mendoza10 vs KairoFC", "PC", "$100.00", "Completed", "Details"],
    ],
  },
  Disputes: {
    headers: ["Case", "Match", "Reason", "Exposure", "SLA", "Action"],
    rows: [
      ["#DSP-2048", "GoalGhost vs VantaXI", "Conflicting scores", "$100.00", "08 min", "Resolve"],
      ["#DSP-2047", "NeoStriker vs Osei10", "Disconnection", "$10.00", "21 min", "Resolve"],
      ["#DSP-2044", "KairoFC vs AxelPro", "Missing evidence", "$50.00", "44 min", "Review"],
      ["#DSP-2041", "Mavrick_J vs RicoNXT", "Rule violation", "$30.00", "1h 12m", "Review"],
    ],
  },
  Transactions: {
    headers: ["Transaction", "Player", "Type", "Amount", "Status", "Action"],
    rows: [
      ["#TX-90421", "GoalGhost", "Prize release", "+$90.00", "Settled", "Receipt"],
      ["#TX-90420", "KairoFC", "Stake lock", "−$25.00", "Escrow", "Inspect"],
      ["#TX-90419", "DrePrime", "Deposit", "+$50.00", "Settled", "Receipt"],
      ["#TX-90418", "VantaXI", "Withdrawal", "−$120.00", "Review", "Approve"],
      ["#TX-90417", "RicoNXT", "Stake refund", "+$10.00", "Settled", "Receipt"],
    ],
  },
  Tournaments: {
    headers: ["Tournament", "Host", "Players", "Escrow", "State", "Action"],
    rows: [
      ["Knockout #108", "Player_Alpha", "5 / 8", "$80.00", "Filling", "Manage"],
      ["Weekend Cup #42", "GoalVault", "32 / 32", "$640.00", "Round 2", "Manage"],
      ["Mobile Kings #19", "DrePrime", "16 / 16", "$160.00", "Semi-final", "Manage"],
      ["High Roller #07", "Mendoza10", "7 / 8", "$800.00", "Filling", "Review"],
    ],
  },
  "Risk & Limits": {
    headers: ["Signal", "Player", "Risk Level", "Exposure", "Detected", "Action"],
    rows: [
      ["Velocity anomaly", "VantaXI", "High", "$240.00", "2 min ago", "Freeze"],
      ["Shared device", "NeoStriker", "Medium", "$65.00", "14 min ago", "Inspect"],
      ["Repeated disconnect", "Osei10", "Medium", "$30.00", "26 min ago", "Limit"],
      ["Deposit pattern", "AxelPro", "Low", "$110.00", "1h ago", "Review"],
    ],
  },
};

function AdminTableView({ view }: { view: Exclude<AdminView, "Overview" | "Settings"> }) {
  const data = adminRows[view];
  return (
    <>
      <ViewHeading
        copy={`Review and manage ${view.toLowerCase()} across the GoalVault platform.`}
        eyebrow="Operations workspace"
        title={view}
        action={<div className="flex gap-2"><Button className="h-10 px-4 text-xs" variant="secondary">Export CSV</Button><Button className="h-10 px-4 text-xs">Create report</Button></div>}
      />
      <div className="mb-5 grid grid-cols-3 gap-4">
        {[
          [view === "Transactions" ? "$48.2K" : view === "Players" ? "12,482" : view === "Disputes" ? "4" : "18", "total records"],
          [view === "Risk & Limits" ? "1" : view === "Tournaments" ? "7" : "3", "requires action"],
          ["99.8%", "within service level"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#626772]">{label}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-[#292c32] bg-[#121418]">
        <div className="grid grid-cols-6 bg-[#181a1f] px-5 py-3">
          {data.headers.map((header, index) => <span className={`text-[8px] font-black uppercase tracking-[0.13em] text-[#5f646e] ${index === 5 ? "text-right" : ""}`} key={header}>{header}</span>)}
        </div>
        {data.rows.map((row) => (
          <div className="grid grid-cols-6 items-center border-t border-[#272a2f] px-5 py-4" key={row[0]}>
            {row.map((cell, index) => index === 5 ? (
              <div className="text-right" key={cell}><button className="rounded-md border border-[#34373d] px-3 py-1.5 text-[9px] font-bold text-[#00FF66] transition hover:border-[#00FF66]" type="button">{cell}</button></div>
            ) : (
              <span className={`truncate pr-3 text-[10px] ${index === 0 ? "font-bold text-white" : cell === "High" || cell.includes("review") || cell.includes("pending") ? "font-bold text-[#f59e0b]" : "text-[#858a95]"}`} key={`${cell}-${index}`}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function AdminSettings() {
  return (
    <>
      <ViewHeading copy="Control global platform behavior, settlement rules, and staff permissions." eyebrow="Restricted configuration" title="Platform settings" action={<Button className="h-10 px-5 text-xs">Save changes</Button>} />
      <div className="grid grid-cols-2 gap-5">
        {[
          ["Escrow & settlement", [["Auto-release verified prizes", true], ["Require evidence above $50", true], ["Allow manual refunds", false]]],
          ["Player protection", [["Enforce monthly play limits", true], ["Block underage registrations", true], ["Enable cooling-off mode", true]]],
          ["Match integrity", [["Flag repeated disconnects", true], ["Cross-check duplicate devices", true], ["Auto-forfeit after 30 minutes", true]]],
          ["Communications", [["Send transaction receipts", true], ["Notify admins of high-risk stakes", true], ["Weekly operations digest", false]]],
        ].map(([title, settings]) => (
          <article className="rounded-lg border border-[#292c32] bg-[#14161a] p-6" key={title as string}>
            <h3 className="text-sm font-black text-white">{title as string}</h3>
            <div className="mt-4">
              {(settings as (string | boolean)[][]).map(([label, checked]) => (
                <label className="flex items-center justify-between border-t border-[#282b30] py-4 text-[10px] font-semibold text-[#8c919b]" key={label as string}>
                  {label as string}<input className="size-4 accent-[#00FF66]" defaultChecked={checked as boolean} type="checkbox" />
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function AdminOverview({ setView }: { setView: (view: AdminView) => void }) {
  const metrics = [
    ["$48,240", "gross stake volume", "+12.8%", "stake"],
    ["$7,416", "escrow currently locked", "184 matches", "lock"],
    ["12,482", "verified players", "+316 this week", "shield"],
    ["4", "open disputes", "1 high priority", "headset"],
  ];
  return (
    <>
      <ViewHeading copy="Live operational health across players, money movement, and match integrity." eyebrow="All systems operational" title="Control room" action={<div className="rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 px-4 py-2 text-[9px] font-bold text-[#00FF66]">Updated just now</div>} />
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(([value, label, delta, icon]) => (
          <article className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <div className="flex items-start justify-between"><div className="flex size-9 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]"><Icon name={icon as IconName} size={17} /></div><span className="text-[8px] font-bold text-[#00FF66]">{delta}</span></div>
            <p className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#626772]">{label}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[1.25fr_.75fr] gap-5">
        <article className="rounded-lg border border-[#292c32] bg-[#14161a]">
          <div className="flex items-center justify-between border-b border-[#292c32] px-6 py-4"><div><h3 className="text-sm font-black text-white">Stake volume</h3><p className="mt-1 text-[9px] text-[#636872]">Seven-day settled and locked volume</p></div><button className="text-[9px] font-bold text-[#00FF66]" onClick={() => setView("Transactions")} type="button">Open ledger →</button></div>
          <div className="relative h-[215px] p-6">
            <div className="absolute inset-x-6 top-7 space-y-[42px]">{[0, 1, 2, 3].map((line) => <div className="h-px bg-[#25282d]" key={line} />)}</div>
            <div className="relative flex h-full items-end justify-between gap-3">
              {[42, 58, 46, 72, 66, 88, 78, 96, 83, 112, 101, 132, 118, 148].map((height, index) => <div className="flex flex-1 items-end gap-1" key={index}><span className="w-1/2 rounded-t-sm bg-[#29332d]" style={{ height }} /><span className="w-1/2 rounded-t-sm bg-[#00FF66]" style={{ height: height * .72 }} /></div>)}
            </div>
          </div>
          <div className="flex justify-between border-t border-[#292c32] px-6 py-3 text-[8px] uppercase tracking-[0.12em] text-[#565b65]"><span>Mon 08</span><span>Tue 09</span><span>Wed 10</span><span>Thu 11</span><span>Fri 12</span><span>Sat 13</span><span>Today</span></div>
        </article>
        <article className="rounded-lg border border-[#292c32] bg-[#14161a]">
          <div className="flex items-center justify-between border-b border-[#292c32] px-5 py-4"><h3 className="text-sm font-black text-white">Dispute queue</h3><button className="text-[9px] font-bold text-[#00FF66]" onClick={() => setView("Disputes")} type="button">View all</button></div>
          <div className="divide-y divide-[#282b30]">
            {[["#2048", "Conflicting scores", "$100", "08 min"], ["#2047", "Disconnection", "$10", "21 min"], ["#2044", "Missing evidence", "$50", "44 min"]].map(([id, reason, value, time], index) => (
              <div className="flex items-center gap-3 p-4" key={id}><span className={`size-2 rounded-full ${index === 0 ? "bg-[#ef4444]" : "bg-[#f59e0b]"}`} /><div className="min-w-0 flex-1"><p className="text-[10px] font-bold text-white">{id} • {reason}</p><p className="mt-1 text-[8px] text-[#626772]">{value} exposure</p></div><span className="text-[8px] font-bold text-[#858a95]">{time}</span></div>
            ))}
          </div>
          <div className="m-4 rounded-lg border border-[#29332d] bg-[#101612] p-4"><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#69746d]">Resolution SLA</p><div className="mt-3 flex items-end justify-between"><p className="text-2xl font-black text-[#00FF66]">94.2%</p><p className="text-[8px] text-[#666d69]">within 60 minutes</p></div></div>
        </article>
      </div>
      <div className="mt-5 grid grid-cols-[1fr_320px] gap-5">
        <div className="overflow-hidden rounded-lg border border-[#292c32] bg-[#121418]">
          <div className="flex items-center justify-between px-5 py-4"><h3 className="text-sm font-black text-white">Players requiring attention</h3><button className="text-[9px] font-bold text-[#00FF66]" onClick={() => setView("Players")} type="button">Open player controls</button></div>
          {[["VantaXI", "Withdrawal velocity anomaly", "High"], ["DrePrime", "Identity verification pending", "Medium"], ["Osei10", "Repeated match disconnections", "Medium"]].map(([player, signal, risk]) => (
            <div className="grid grid-cols-[1fr_1.5fr_80px] items-center border-t border-[#272a2f] px-5 py-3.5" key={player}><p className="text-[10px] font-bold text-white">{player}</p><p className="text-[9px] text-[#717680]">{signal}</p><span className={`text-right text-[8px] font-black uppercase ${risk === "High" ? "text-[#ef4444]" : "text-[#f59e0b]"}`}>{risk}</span></div>
          ))}
        </div>
        <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5"><h3 className="text-sm font-black text-white">Platform health</h3><div className="mt-5 space-y-4">{[["Match verification", "99.99%"], ["Wallet service", "100%"], ["Identity provider", "99.96%"], ["Notification queue", "99.92%"]].map(([service, uptime]) => <div className="flex items-center justify-between" key={service}><span className="flex items-center gap-2 text-[9px] text-[#777c86]"><span className="size-1.5 rounded-full bg-[#00FF66]" />{service}</span><span className="text-[9px] font-bold text-white">{uptime}</span></div>)}</div></div>
      </div>
    </>
  );
}

function AdminFrame() {
  const [view, setView] = useState<AdminView>("Overview");
  const navigation: { label: AdminView; icon: IconName; badge?: string }[] = [
    { label: "Overview", icon: "grid" },
    { label: "Players", icon: "shield", badge: "3" },
    { label: "Matches", icon: "controller", badge: "184" },
    { label: "Disputes", icon: "headset", badge: "4" },
    { label: "Transactions", icon: "wallet" },
    { label: "Tournaments", icon: "crown", badge: "7" },
    { label: "Risk & Limits", icon: "lock", badge: "1" },
    { label: "Settings", icon: "stake" },
  ];
  return (
    <section className="frame relative flex w-[1440px] shrink-0 overflow-hidden bg-[#0C0D10]">
      <FrameLabel number="05" title="GoalVault Admin Console" />
      <aside className="flex w-[250px] shrink-0 flex-col border-r border-[#282b31] bg-[#0f1114] px-5 pb-6 pt-19">
        <div className="px-3"><Brand /><div className="mt-4 w-fit rounded border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-1 text-[7px] font-black uppercase tracking-[0.14em] text-[#f59e0b]">Admin access</div></div>
        <p className="mb-3 mt-9 px-3 text-[8px] font-black uppercase tracking-[0.17em] text-[#4f545e]">Operations</p>
        <nav className="space-y-1">
          {navigation.map((item) => <button className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[10px] font-bold transition ${view === item.label ? "bg-[#00FF66]/10 text-[#00FF66]" : "text-[#858a95] hover:bg-white/[0.04] hover:text-white"}`} key={item.label} onClick={() => setView(item.label)} type="button"><Icon name={item.icon} size={16} /><span className="flex-1">{item.label}</span>{item.badge && <span className={`rounded px-1.5 py-0.5 text-[8px] ${view === item.label ? "bg-[#00FF66] text-[#07140c]" : "bg-[#26292e] text-[#7e838d]"}`}>{item.badge}</span>}</button>)}
        </nav>
        <div className="mt-auto rounded-lg border border-[#332f25] bg-[#17150f] p-4"><p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#f59e0b]">Audit mode enabled</p><p className="mt-2 text-[9px] leading-4 text-[#797363]">Every administrative action is logged and attributed to your session.</p></div>
        <div className="mt-4 flex items-center gap-3 border-t border-[#25282d] px-2 pt-4"><div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#334155] to-[#64748b] text-[9px] font-black">AO</div><div className="flex-1"><p className="text-[10px] font-bold text-white">Amara Okafor</p><p className="mt-0.5 text-[8px] text-[#626772]">Super administrator</p></div><span className="size-2 rounded-full bg-[#00FF66]" /></div>
      </aside>
      <div className="min-w-0 flex-1 pt-14">
        <header className="flex h-18 items-center justify-between border-b border-[#282b31] bg-[#0e0f12] px-8"><div><p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#5f646e]">GoalVault operations</p><p className="mt-1 text-xs font-bold text-white">Production environment <span className="ml-2 text-[#00FF66]">• Healthy</span></p></div><div className="flex items-center gap-3"><button className="relative flex size-10 items-center justify-center rounded-lg border border-[#2b2e34] text-[#7d828c]" type="button"><Icon name="bolt" size={16} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#ef4444]" /></button><div className="rounded-lg border border-[#2b2e34] bg-[#15171b] px-4 py-2"><p className="text-[8px] uppercase tracking-[0.12em] text-[#5f646e]">Today’s volume</p><p className="mt-1 text-xs font-black text-white">$12,840.00</p></div></div></header>
        <main className="px-8 py-7">
          {view === "Overview" && <AdminOverview setView={setView} />}
          {view === "Settings" && <AdminSettings />}
          {view !== "Overview" && view !== "Settings" && <AdminTableView view={view} />}
        </main>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="canvas">
      <div className="flex gap-12 p-12">
        <LandingFrame />
        <AuthFrame mode="login" />
        <AuthFrame mode="register" />
        <DashboardFrame />
        <AdminFrame />
      </div>
    </main>
  );
}
