import Link from "next/link";
import { Brand, Button, Icon } from "../components/ui";

export const metadata = {
  title: "Privacy Policy // efChamps",
  description: "Official Privacy Policy for efChamps. Learn how we handle your data, payment security, gamer credentials, and privacy rights.",
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-[-150px] top-10 size-[600px] rounded-full bg-[#00FF66]/[0.04] blur-[140px]" />

      {/* Header */}
      <header className="relative z-20 mx-auto max-w-[1280px] px-4 sm:px-6 py-6 flex items-center justify-between border-b border-white/[0.08]">
        <Link href="/">
          <Brand />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/terms" className="text-xs font-bold text-[#8d929d] hover:text-white transition hidden sm:inline">
            Terms &amp; Conditions
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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF66]">Data Protection &amp; Security</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-[#737883]">
            Last updated: October 2026 • Compliant with NDPR &amp; Global Data Protection standards.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-[#9ca3af]">
          {/* Section 1 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">01.</span> Overview &amp; Commitment
            </h2>
            <p className="mt-3">
              At <strong className="text-white">efChamps</strong>, we take your personal privacy, gamer identity, and transaction security seriously. This Privacy Policy details what information we collect when you use our platform (efchamps.app), how it is processed, protected, and shared, and how you can exercise your privacy rights.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">02.</span> Information We Collect
            </h2>
            <div className="mt-3 space-y-3">
              <p>We only collect data necessary to provide seamless P2P matchmaking, secure escrow staking, and compliant payment payouts:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Account Details:</strong> Full name, email address, password hash (encrypted with bcrypt), and phone number.</li>
                <li><strong className="text-white">Gaming Profiles:</strong> In-game username / Gamertag / Konami ID, gaming platform (Mobile, PS5, Xbox, PC), match statistics, and win/loss records.</li>
                <li><strong className="text-white">Financial &amp; Payout Data:</strong> Bank account numbers and account holder names for receiving staking payouts. <span className="text-[#00FF66]">Note:</span> We do not store raw card numbers, PINs, or CVVs on our servers. All card payment processing is securely managed by Paystack.</li>
                <li><strong className="text-white">Proof of Match Media:</strong> Screenshots, video recordings, and dispute documentation submitted for match settlement verification.</li>
                <li><strong className="text-white">Technical &amp; Telemetry Data:</strong> IP addresses, browser types, session timestamps, and device identifiers to prevent multi-accounting, fraud, and unauthorized access.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">03.</span> How We Use Your Information
            </h2>
            <div className="mt-3 space-y-3">
              <p>Your information is used strictly to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create and administer your efChamps account and wallet.</li>
                <li>Verify your eligibility and prevent underage access (18+ requirement).</li>
                <li>Facilitate fair peer-to-peer matchmaking, match challenges, and bracketed tournaments.</li>
                <li>Escrow stake deposits and process bank withdrawals swiftly and reliably.</li>
                <li>Investigate disputes, score collisions, disconnections, and suspicious activities.</li>
                <li>Send platform notifications regarding match invites, tournament starts, and wallet settlements.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">04.</span> Payment Processing &amp; Financial Security
            </h2>
            <p className="mt-3">
              Payment deposits are processed via <strong className="text-white">Paystack</strong>, a PCI-DSS certified payments provider. All transactions are transmitted via end-to-end TLS/HTTPS encryption. efChamps does not hold or have access to your bank card credentials. Bank details submitted for withdrawals are stored under strict database encryption and used exclusively to disburse won or refunded funds.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">05.</span> Data Sharing &amp; Third Parties
            </h2>
            <div className="mt-3 space-y-3">
              <p>
                We do not sell, rent, or trade your personal information to advertisers or external commercial third parties. We share information only with:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Opponents:</strong> Your gamer handle, chosen platform, and match score are visible to other players in the lobby and match screens.</li>
                <li><strong className="text-white">Service Providers:</strong> Payment gateways (Paystack), transactional notification services, and cloud hosting infrastructure operating under strict confidentiality.</li>
                <li><strong className="text-white">Regulatory / Legal Authorities:</strong> If required by Nigerian law, court subpoena, or in connection with severe fraud / cybercrime prevention.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">06.</span> Account Security &amp; Data Retention
            </h2>
            <p className="mt-3">
              We employ industry-standard security measures including encrypted sessions, salt-hashed passwords, role-based admin controls, and DDoS mitigation. We retain your transaction logs and match history for as long as your account remains active or as required by financial auditing laws. Inactive or closed accounts may request data deletion subject to regulatory requirements.
            </p>
          </section>

          {/* Section 7 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">07.</span> Your Rights
            </h2>
            <div className="mt-3 space-y-3">
              <p>Under applicable data privacy frameworks, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access the personal data we hold about you.</li>
                <li>Request rectification of inaccurate information (e.g., updating your Gamertag or phone number).</li>
                <li>Request account deactivation and removal of your personal profiles.</li>
                <li>Opt out of marketing communications at any time.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="rounded-xl border border-[#292c32] bg-[#14161a] p-6 sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#00FF66]">08.</span> Contact &amp; Privacy Officer
            </h2>
            <p className="mt-3">
              If you have inquiries, complaints, or requests regarding this Privacy Policy or how your information is handled, contact our Data Protection Team at <span className="text-[#00FF66] font-mono">support@efchamps.app</span> or submit a ticket through the dashboard support module.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-14 border-t border-[#292c32] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737883]">
          <p>© 2026 efChamps. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition">
              Terms &amp; Conditions
            </Link>
            <Link href="/dashboard" className="text-[#00FF66] font-bold hover:underline">
              Player Lobby →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
