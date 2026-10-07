"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Button } from "../../components/ui";
import { ViewHeading } from "../page";

export default function AdminSettingsPage() {
  const [duration, setDuration] = useState<number>(6);
  const [autoForfeitMinutes, setAutoForfeitMinutes] = useState<number>(5);
  const [feePercentage, setFeePercentage] = useState<number>(10);
  const [disputeRules, setDisputeRules] = useState<string>("Clear in-game final whistle screenshot or recording showing final score, Konami ID/PSN/Gamertag, and match stats. Uncropped, unedited JPG/PNG only.");
  const [acceptedFormats, setAcceptedFormats] = useState<string>("JPG, PNG, WEBP (Max 10MB per image)");
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>("");

  useEffect(() => {
    api.getAdminSettings()
      .then((settings: any) => {
        if (settings?.DEFAULT_MATCH_DURATION_MINUTES) setDuration(Number(settings.DEFAULT_MATCH_DURATION_MINUTES));
        if (settings?.AUTO_FORFEIT_GRACE_MINUTES) setAutoForfeitMinutes(Number(settings.AUTO_FORFEIT_GRACE_MINUTES));
        if (settings?.PLATFORM_FEE_PERCENTAGE) setFeePercentage(Number(settings.PLATFORM_FEE_PERCENTAGE));
        if (settings?.DISPUTE_IMAGE_RULES) setDisputeRules(settings.DISPUTE_IMAGE_RULES);
        if (settings?.DISPUTE_ACCEPTED_FORMATS) setAcceptedFormats(settings.DISPUTE_ACCEPTED_FORMATS);
      })
      .catch(() => {
        api.getMatchDuration()
          .then((res: any) => {
            if (res?.minutes) setDuration(res.minutes);
          })
          .catch(() => {});
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await Promise.all([
        api.setMatchDuration(duration),
        api.updateAdminSetting("AUTO_FORFEIT_GRACE_MINUTES", String(autoForfeitMinutes), "Grace period in minutes after match duration expires before auto-forfeit awards win to reporting player"),
        api.updateAdminSetting("PLATFORM_FEE_PERCENTAGE", String(feePercentage), "Global platform rake fee percentage deducted from match prize pools"),
        api.updateAdminSetting("DISPUTE_IMAGE_RULES", disputeRules, "Dispute evidence guidelines and acceptance criteria shown to players"),
        api.updateAdminSetting("DISPUTE_ACCEPTED_FORMATS", acceptedFormats, "Supported screenshot and video formats for disputes"),
      ]);
      setSavedMsg("All platform settings updated successfully!");
    } catch (e: any) {
      alert(e.message || "Failed to update platform settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ViewHeading
        action={
          <div className="flex items-center gap-3">
            {savedMsg && <span className="text-xs font-bold text-[#00FF66]">{savedMsg}</span>}
            <Button className="h-10 px-5 text-xs" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        }
        copy="Control global platform behavior, settlement commission fees, dispute rules, and match duration limits."
        eyebrow="Restricted configuration"
        title="Platform settings"
      />

      {/* Platform Fee Percentage Setting Card */}
      <div className="mb-6 rounded-lg border border-[#00FF66]/30 bg-[#14161a] p-6 shadow-[0_0_30px_rgba(0,255,102,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00FF66]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Platform Fee Commission (Rake %)</h3>
            </div>
            <p className="mt-1 text-xs text-[#737883]">
              Editable percentage taken by efChamps on each completed match prize pool. Currently set to <span className="text-[#00FF66] font-bold">{feePercentage}%</span> (Winner takes {100 - feePercentage}% of combined stakes).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={50}
              value={feePercentage}
              onChange={(e) => setFeePercentage(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="h-11 w-24 rounded-lg border border-[#2b2e35] bg-[#0c0d10] px-3 text-center text-base font-black text-[#00FF66] focus:border-[#00FF66] focus:outline-none"
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider">% Rake</span>
          </div>
        </div>
      </div>

      {/* Dispute Evidence Guidelines Setting Card */}
      <div className="mb-6 rounded-lg border border-[#292c32] bg-[#14161a] p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="size-2 rounded-full bg-[#ef4444]" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Dispute Evidence &amp; Accepted Proof Rules</h3>
        </div>
        <p className="text-xs text-[#737883] mb-4">
          Specify the criteria players must meet when uploading screenshot proofs to Cloudinary during a contested match. These rules appear in the Match Room for both players.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
              Required Image Content &amp; Fair Play Rules
            </label>
            <textarea
              rows={3}
              value={disputeRules}
              onChange={(e) => setDisputeRules(e.target.value)}
              className="w-full rounded-lg border border-[#2b2e35] bg-[#0c0d10] p-3 text-xs text-white placeholder-[#505561] focus:border-[#00FF66] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
              Accepted Image Formats &amp; Specifications
            </label>
            <input
              type="text"
              value={acceptedFormats}
              onChange={(e) => setAcceptedFormats(e.target.value)}
              className="w-full h-10 rounded-lg border border-[#2b2e35] bg-[#0c0d10] px-3 text-xs text-white placeholder-[#505561] focus:border-[#00FF66] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Time To Complete / Match Timer Setting Card */}
      <div className="mb-6 rounded-lg border border-[#292c32] bg-[#14161a] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00FF66]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Default Match Time to Complete</h3>
            </div>
            <p className="mt-1 text-xs text-[#737883]">
              Set how long players have to finish their match and submit scores in the Match Room before results lock or dispute triggers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-11 w-24 rounded-lg border border-[#2b2e35] bg-[#0c0d10] px-3 text-center text-base font-black text-[#00FF66] focus:border-[#00FF66] focus:outline-none"
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Minutes</span>
          </div>
        </div>
      </div>

      {/* Automated Match Timer Forfeit Grace Period Setting Card */}
      <div className="mb-6 rounded-lg border border-[#00FF66]/30 bg-[#14161a] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00FF66]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Automated Timer Forfeit Grace Period</h3>
            </div>
            <p className="mt-1 text-xs text-[#737883]">
              If one player reports their score while their opponent is unresponsive, automatically forfeit the opponent and award the win after Match Duration + Grace Period (currently <span className="text-[#00FF66] font-bold">{duration + autoForfeitMinutes} minutes</span> total).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={60}
              value={autoForfeitMinutes}
              onChange={(e) => setAutoForfeitMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
              className="h-11 w-24 rounded-lg border border-[#2b2e35] bg-[#0c0d10] px-3 text-center text-base font-black text-[#00FF66] focus:border-[#00FF66] focus:outline-none"
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Grace Mins</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          ["Escrow & settlement", [["Auto-release verified prizes", true], ["Require evidence above ₦50,000", true], ["Allow manual refunds", false]]],
          ["Player protection", [["Enforce monthly play limits", true], ["Block underage registrations", true], ["Enable cooling-off mode", true]]],
          ["Match integrity", [["Flag repeated disconnects", true], ["Cross-check duplicate devices", true], [`Auto-forfeit after ${duration} minutes`, true]]],
          ["Communications", [["Send transaction receipts", true], ["Notify admins of high-risk stakes", true], ["Weekly operations digest", false]]],
        ].map(([title, settings]) => (
          <article className="rounded-lg border border-[#292c32] bg-[#14161a] p-6" key={title as string}>
            <h3 className="text-sm font-black text-white">{title as string}</h3>
            <div className="mt-4">
              {(settings as (string | boolean)[][]).map(([label, checked]) => (
                <label className="flex items-center justify-between border-t border-[#282b30] py-4 text-[10px] font-semibold text-[#8c919b]" key={label as string}>
                  {label as string}
                  <input className="size-4 accent-[#00FF66]" defaultChecked={checked as boolean} type="checkbox" />
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
