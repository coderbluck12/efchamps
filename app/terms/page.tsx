import Link from "next/link";
import { Brand, Button, Icon } from "../components/ui";

export const metadata = {
  title: "Terms and Conditions // efChamps",
  description: "Official Terms and Conditions, rules of engagement, stake settlement policies, and fair play standards for efChamps.",
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute right-[-150px] top-10 size-[600px] rounded-full bg-[#00FF66]/[0.04] blur-[140px]" />

      {/* Header */}
      <header className="relative z-20 mx-auto max-w-[1280px] px-4 sm:px-6 py-6 flex items-center justify-between border-b border-white/[0.08]">
        <Link href="/">
          <Brand />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="text-xs font-bold text-[#8d929d] hover:text-white transition hidden sm:inline">
            Privacy Policy
          </Link>
          <Button href="/dashboard" className="h-10 px-4 text-xs" variant="secondary">
            Go to Lobby →
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-[900px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10 border-b border-[#292c32] pb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF66]">Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-[#737883]">
            Last updated: October 2026 • Effective immediately for all registered users on efChamps.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-[#9ca3af]">
          {/* Section 1 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">01.</span> Acceptance of Terms
            </h2>
            <p className="mt-3">
              By accessing, registering an account on, or depositing funds into <strong className="text-white">efChamps</strong> (efchamps.app), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions. If you do not agree to any part of these terms, you must discontinue using our services immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">02.</span> Eligibility &amp; Age Verification
            </h2>
            <p className="mt-3">
              To participate in real-money challenges, stakes, or tournaments on efChamps:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[#b0b6c2]">
              <li>You must be at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction).</li>
              <li>You must legally reside in a jurisdiction where skill-based gaming and peer-to-peer online sports challenges are permitted.</li>
              <li>You may only maintain one active account on efChamps. Creating duplicate or burner accounts will result in immediate termination and forfeiture of funds.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">03.</span> Peer-to-Peer Skill Gaming &amp; Escrow
            </h2>
            <p className="mt-3">
              efChamps is a peer-to-peer skill esports competition platform for verified eFootball matches. Match outcomes depend entirely on player skill, tactical proficiency, and sports gaming execution.
            </p>
            <p className="mt-3">
              When a challenge is created or accepted, both players&apos; stakes are held safely in a <strong>cryptographically auditable escrow pool</strong>. Funds remain locked until both participants confirm the result or an administrative dispute review is finalized.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">04.</span> Match Rules &amp; Result Reporting
            </h2>
            <div className="space-y-3 mt-3">
              <p>
                <strong>Console Room &amp; Connection:</strong> The challenge host generates the in-game room invite code and shares it inside the official Match Room. Both players must ensure a stable, low-latency broadband internet connection.
              </p>
              <p>
                <strong>Result Submission:</strong> Within 15 minutes of match conclusion, both competitors must enter and submit their respective scores in the Match Room.
              </p>
              <p>
                <strong>Disconnections:</strong> Any intentional disconnection, rage-quitting, or deliberate network disruption constitutes an immediate forfeit. The non-disconnecting player will be awarded the win upon submission of video or screenshot evidence.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">05.</span> Dispute Resolution &amp; Anti-Fraud
            </h2>
            <p className="mt-3">
              In the event of conflicting reported scores, the match status automatically moves to <strong>DISPUTED</strong>, and escrow funds are frozen.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[#b0b6c2]">
              <li>Both players have the opportunity to submit match screenshots or full match recording links (e.g. YouTube, Twitch, Imgur, or Google Drive).</li>
              <li>Official efChamps staff and tournament arbiters will inspect the photographic/video proof and issue a final, binding determination.</li>
              <li>Any fraudulent evidence, altered screenshots, or false score claims will result in a permanent ban and account balance confiscation.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">06.</span> Deposits, Withdrawals &amp; Platform Fees
            </h2>
            <p className="mt-3">
              All deposits made via approved payment processors (such as Paystack, debit cards, and bank transfers) are credited in Nigerian Naira (₦).
            </p>
            <p className="mt-3">
              A standard platform rake/service fee is deducted from the winner&apos;s prize pool to cover hosting, escrow security, server infrastructure, and prize guarantees. All withdrawals to verified Nigerian bank accounts are reviewed and disbursed rapidly in accordance with standard banking settlement times.
            </p>
          </section>

          {/* Section 7 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">07.</span> Responsible Gaming
            </h2>
            <p className="mt-3">
              efChamps provides customizable monthly stake and deposit limits in the Secure Wallet view. Players are urged to play responsibly and never stake funds they cannot afford to lose. Self-exclusion and timeout features are available upon request to customer support.
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-xl border border-[#00FF66]/30 bg-gradient-to-r from-[#142319] to-[#0f1712] p-8 text-center">
          <h3 className="text-xl font-black text-white">Have questions about our terms?</h3>
          <p className="mt-2 text-xs text-[#8d929d]">
            Our support desk and arbiters are available 24/7 to answer your inquiries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/dashboard/support" className="h-11 px-6 text-xs">
              Contact Player Support
            </Button>
            <Button href="/privacy" className="h-11 px-6 text-xs" variant="secondary">
              Read Privacy Policy
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#292c32] bg-[#090a0c] px-6 py-8 text-center text-xs text-[#626771]">
        <p>© 2026 efChamps. All rights reserved. Competitive eFootball staking platform.</p>
      </footer>
    </div>
  );
}
