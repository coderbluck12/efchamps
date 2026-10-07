import type { ReactNode } from "react";

export type IconName =
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
  | "logout"
  | "mobile"
  | "plus"
  | "shield"
  | "stake"
  | "wallet";

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
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
      className={`shrink-0 ${className}`}
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

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 items-center justify-center text-[#00FF66]">
        <svg aria-label="efChamps logo" fill="none" height="40" viewBox="0 0 40 40" width="40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2 35 10v17L20 38 5 27V10L20 2Z" fill="#00FF66" fillOpacity=".08" stroke="#00FF66" strokeWidth="1.5" />
          <path d="M11 25V13h18v12M15 25v-8h10v8" stroke="#00FF66" strokeLinecap="square" strokeWidth="2" />
          <circle cx="20" cy="24" fill="#0C0D10" r="5" stroke="#00FF66" strokeWidth="1.5" />
          <path d="m20 19 3 2-1 3h-4l-1-3 3-2Zm-2 5-2 3m6-3 2 3" stroke="#00FF66" strokeWidth="1" />
        </svg>
      </div>
      {!compact && (
        <div className="font-black tracking-[-0.045em] text-white">
          EF<span className="text-[#00FF66]">CHAMPS</span>
          <span className="mt-0.5 block text-[6px] font-bold tracking-[0.28em] text-[#626771]">PLAY • PROVE • COLLECT</span>
        </div>
      )}
    </div>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  onClick,
  type = "button",
  href,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: (event?: any) => void;
  type?: "button" | "submit";
  href?: string;
  disabled?: boolean;
}) {
  const variants = {
    primary:
      "bg-[#00FF66] text-[#06150c] shadow-[0_0_30px_rgba(0,255,102,.13)] hover:bg-[#4dff93] hover:shadow-[0_0_36px_rgba(0,255,102,.25)]",
    secondary:
      "border border-[#2b2e35] bg-[#17191e] text-white hover:border-[#00FF66]/50 hover:text-[#00FF66]",
    ghost: "text-[#969ba6] hover:bg-white/5 hover:text-white",
  };

  const combinedClasses = `inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 active:translate-y-px ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a className={combinedClasses} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} onClick={onClick} type={type} disabled={disabled} style={disabled ? {opacity: 0.5, cursor: "not-allowed"} : {}}>
      {children}
    </button>
  );
}

export function Field({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name?: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">{label}</span>
      <input
        name={name}
        className="h-13 w-full rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-white outline-none transition placeholder:text-[#51555e] focus:border-[#00FF66] focus:ring-2 focus:ring-[#00FF66]/10"
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

export function SelectField({
  label = "Platform",
  name,
  options = ["PS5", "Xbox", "PC", "Mobile"],
  placeholder = "Select your platform",
  value,
  onChange,
}: {
  label?: string;
  name?: string;
  options?: string[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#888d98]">{label}</span>
      <div className="relative">
        <select
          name={name}
          className="h-13 w-full appearance-none rounded-lg border border-[#2a2d33] bg-[#0d0f12] px-4 text-sm text-[#d8dbe1] outline-none transition focus:border-[#00FF66] focus:ring-2 focus:ring-[#00FF66]/10"
          defaultValue={options[0] || ""}
          onChange={onChange}
          value={value}
        >
          <option disabled value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#747984]">
          <Icon name="chevron" size={17} />
        </span>
      </div>
    </label>
  );
}
