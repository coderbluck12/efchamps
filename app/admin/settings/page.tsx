"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Button } from "../../components/ui";
import { ViewHeading } from "../page";

export default function AdminSettingsPage() {
  const [duration, setDuration] = useState<number>(6);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>("");

  useEffect(() => {
    api.getMatchDuration()
      .then((res: any) => {
        if (res?.minutes) setDuration(res.minutes);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await api.setMatchDuration(duration);
      setSavedMsg("Settings updated successfully!");
    } catch (e: any) {
      alert(e.message || "Failed to update match duration");
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
        copy="Control global platform behavior, settlement rules, and match duration limits."
        eyebrow="Restricted configuration"
        title="Platform settings"
      />

      {/* Time To Complete / Match Timer Setting Card */}
      <div className="mb-6 rounded-lg border border-[#00FF66]/30 bg-[#14161a] p-6 shadow-[0_0_30px_rgba(0,255,102,0.05)]">
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
