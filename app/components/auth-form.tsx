"use client";

import { useState } from "react";
import Link from "next/link";
import { Brand, Button, Field, Icon, SelectField } from "../components/ui";
import { api, setAuthToken } from "../lib/api";
import { useAuth } from "../lib/auth-context";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const [notice, setNotice] = useState("");
  const isLogin = mode === "login";

  function submit(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("PS5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login({ login: username, password });
        submit("Login successful! Redirecting to lobby...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        await register({ username, email, password, platform });
        submit("Registration completed! ₦5,000 bonus unlocked!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-white flex flex-col justify-between">
      <div className={`grid flex-1 ${isLogin ? "lg:grid-cols-[58%_42%]" : "lg:grid-cols-[42%_58%]"}`}>
        {/* Visual Brand Column */}
        <div className={`relative overflow-hidden border-[#282b30] bg-[#101216] ${isLogin ? "order-1 lg:border-r" : "order-2 lg:border-l"}`}>
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,255,102,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="absolute -right-20 top-24 size-96 lg:size-120 rounded-full border border-[#00FF66]/10" />
          <div className="absolute -right-2 top-42 size-64 lg:size-80 rounded-full border border-[#00FF66]/15" />

          <div className="relative flex h-full flex-col justify-between p-8 sm:p-12 lg:p-20 pt-16 lg:pt-24">
            <Link href="/" className="w-fit">
              <Brand />
            </Link>

            <div className="max-w-[600px] my-10">
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#00FF66]">
                {isLogin ? "Player clearance // 04" : "Build your player identity"}
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-black leading-[0.95] tracking-[-0.055em] text-white">
                {isLogin ? (
                  <>Your next win is <span className="text-[#00FF66]">waiting.</span></>
                ) : (
                  <>One identity. <span className="text-[#00FF66]">Every arena.</span></>
                )}
              </h2>
              <p className="mt-6 max-w-[490px] text-sm sm:text-base leading-7 text-[#858b96]">
                {isLogin
                  ? "Return to your live stakes, match history, and secure balance. The lobby moves fast."
                  : "Your rank, reputation, wallet, and match record travel with you across every supported platform."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-[#29302c] bg-[#0d110f]/80 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                    <Icon name={isLogin ? "shield" : "stake"} size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white">
                      {isLogin ? "Secure session ready" : "First stake protected"}
                    </p>
                    <p className="mt-1 text-[9px] text-[#666d69]">
                      {isLogin ? "Your wallet remains locked until you sign in." : "New players receive guided match verification."}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#00FF66]">
                  <span className="size-1.5 rounded-full bg-[#00FF66]" /> Active
                </span>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[#2a2d32] border-y border-[#2a2d32]">
                {[
                  ["12.4K", "verified players"],
                  ["4.9/5", "player rating"],
                  ["24/7", "match support"],
                ].map(([value, label]) => (
                  <div className="flex min-h-20 flex-col items-center justify-center px-2 sm:px-4 py-5 text-center" key={label}>
                    <p className="text-lg sm:text-xl font-black text-white">{value}</p>
                    <p className="mt-1 whitespace-nowrap text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#5f646e]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className={`relative flex items-center justify-center bg-[#0C0D10] px-6 sm:px-12 lg:px-20 py-12 ${isLogin ? "order-2" : "order-1"}`}>
          <div className="absolute right-6 sm:right-10 top-8 text-xs text-[#666b75]">
            {isLogin ? "New to efChamps?" : "Already registered?"}{" "}
            <Link
              className="font-bold text-[#00FF66] hover:text-white"
              href={isLogin ? "/register" : "/login"}
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </div>

          <div className="w-full max-w-[430px] pt-8 lg:pt-0">
            <div className="mb-9">
              <div className="mb-5 flex size-12 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/10 text-[#00FF66]">
                <Icon name={isLogin ? "lock" : "controller"} size={22} />
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#00FF66]">
                {isLogin ? "Welcome back" : "₦5,000 first-match credit"}
              </p>
              <h2 className="text-3xl sm:text-[42px] font-black tracking-[-0.04em] text-white">
                {isLogin ? "Sign in" : "Create account"}
              </h2>
              <p className="mt-2 text-sm text-[#7d828d]">
                {isLogin ? "Enter your credentials to resume." : "Start your competitive record."}
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isLogin ? (
                <>
                  <Field
                    label="Username or Email"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Field
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex items-center justify-between py-1 text-xs">
                    <label className="flex items-center gap-2 text-[#858a95]">
                      <input className="size-4 accent-[#00FF66]" type="checkbox" /> Remember me
                    </label>
                    <button className="font-semibold text-[#00FF66] hover:text-white" type="button">
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Field
                    label="Desired Username"
                    placeholder="Choose your gamertag"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Field
                    label="Email Address"
                    placeholder="player@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div>
                    <Field
                      label="Password"
                      placeholder="Create a secure password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`h-1 flex-1 rounded-full ${password.length > 0 ? "bg-[#00FF66]" : "bg-[#282b30]"}`} />
                      <span className={`h-1 flex-1 rounded-full ${password.length >= 8 ? (/[A-Z]/.test(password) && /\d/.test(password) ? "bg-[#00FF66]" : "bg-[#00FF66]/35") : "bg-[#282b30]"}`} />
                      <span className={`h-1 flex-1 rounded-full ${password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) ? "bg-[#00FF66]" : "bg-[#282b30]"}`} />
                      <span className={`ml-2 text-[8px] font-bold uppercase tracking-[0.1em] ${password.length >= 8 ? "text-[#00FF66]" : "text-[#6e756f]"}`}>
                        {password.length === 0 ? "8+ characters" : password.length < 8 ? "Too short" : /[A-Z]/.test(password) && /\d/.test(password) ? "Strong" : "Medium"}
                      </span>
                    </div>
                  </div>
                  <SelectField
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  />
                  <label className="flex gap-3 pt-1 text-xs leading-5 text-[#6f747e]">
                    <input className="mt-0.5 size-4 shrink-0 accent-[#00FF66]" defaultChecked type="checkbox" />
                    I’m 18+ and agree to the Terms of Play and responsible gaming policy.
                  </label>
                </>
              )}

              <Button className="h-13 w-full text-sm" type="submit">
                {loading ? "Processing..." : isLogin ? (
                  <><Icon name="shield" size={18} /> Secure Login</>
                ) : (
                  <>Register &amp; Claim Bonus <Icon name="arrow" size={18} /></>
                )}
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
                  <Button className="h-11 text-[10px]" variant="secondary">
                    <Icon name="controller" size={16} /> Continue with PSN
                  </Button>
                  <Button className="h-11 text-[10px]" variant="secondary">
                    <Icon name="controller" size={16} /> Continue with Xbox
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {notice && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border border-[#00FF66]/40 bg-[#151a17] px-6 py-3.5 text-xs font-semibold text-[#00FF66] shadow-2xl z-50">
          <Icon name="check" size={16} /> {notice}
        </div>
      )}
    </div>
  );
}
