"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { Button, Icon } from "../../components/ui";
import { ViewHeading } from "../page";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [resolving, setResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

  const loadDisputes = () => {
    setLoading(true);
    api.getAdminDisputes()
      .then((data) => {
        setDisputes(data);
        if (selectedDispute) {
          const updated = data.find((d: any) => d.id === selectedDispute.id);
          if (updated) setSelectedDispute(updated);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolve = async (winnerId: string, winnerUsername: string) => {
    if (!selectedDispute) return;
    const confirmMsg = `Are you sure you want to award the entire match prize pool (₦${Number(selectedDispute.match?.prizePool || 0).toLocaleString()}) to @${winnerUsername}? This action is irreversible.`;
    if (!confirm(confirmMsg)) return;

    setResolving(true);
    try {
      await api.resolveDispute(selectedDispute.id, winnerId, resolutionNotes || `Admin resolved dispute in favor of @${winnerUsername}`);
      alert(`Dispute resolved! Prize pool awarded to @${winnerUsername}.`);
      loadDisputes();
    } catch (e: any) {
      alert(e.message || "Failed to resolve dispute");
    } finally {
      setResolving(false);
    }
  };

  return (
    <>
      <ViewHeading
        copy="Inspect player uploaded screenshot proofs from Cloudinary with affiliated usernames to adjudicate and settle contested matches."
        eyebrow="Integrity management"
        title="Match Disputes &amp; Proof Inspector"
      />

      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          [disputes.length.toString(), "total disputes in database"],
          [disputes.filter(d => d.status === "IN_REVIEW").length.toString(), "pending review"],
          [disputes.filter(d => d.status === "RESOLVED").length.toString(), "resolved disputes"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-[#292c32] bg-[#14161a] p-5" key={label}>
            <p className="text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#626772]">{label}</p>
          </div>
        ))}
      </div>

      {/* Main Dispute Management Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Dispute List Table */}
        <div className={`overflow-x-auto rounded-lg border border-[#292c32] bg-[#121418] ${selectedDispute ? "lg:col-span-6" : "lg:col-span-12"}`}>
          <div className="min-w-[500px]">
            <div className="grid grid-cols-5 bg-[#181a1f] px-5 py-3 text-[8px] font-black uppercase tracking-[0.13em] text-[#5f646e]">
              <span>Dispute / Match</span>
              <span>Raised By</span>
              <span>Reason</span>
              <span>Status</span>
              <span className="text-right">Action</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-[#737883]">Loading disputes from database...</div>
            ) : disputes.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#737883]">
                No active dispute records found in database. All matches settled normally.
              </div>
            ) : (
              disputes.map((d) => (
                <div
                  className={`grid grid-cols-5 items-center border-t border-[#272a2f] px-5 py-4 text-[10px] cursor-pointer transition ${
                    selectedDispute?.id === d.id ? "bg-[#1a201c] border-l-2 border-l-[#00FF66]" : "hover:bg-[#16181d]"
                  }`}
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                >
                  <div>
                    <span className="font-mono font-bold text-white">#{d.id.substring(0, 8)}</span>
                    <p className="text-[9px] text-[#636872]">Match #{d.match?.id?.substring(0, 6) || "N/A"}</p>
                  </div>
                  <span className="font-bold text-white">@{d.raisedBy?.username || "Unknown"}</span>
                  <span className="text-[#858a95] truncate pr-2">{d.reason || "Score conflict"}</span>
                  <div>
                    <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                      d.status === "IN_REVIEW"
                        ? "bg-[#ef4444]/10 text-[#ef4444]"
                        : "bg-[#00FF66]/10 text-[#00FF66]"
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDispute(d);
                      }}
                      className="rounded-md border border-[#34373d] px-2.5 py-1 text-[9px] font-bold text-[#00FF66] transition hover:border-[#00FF66]"
                    >
                      Inspect Proofs →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Detailed Proofs & Adjudication Inspector */}
        {selectedDispute && (
          <div className="lg:col-span-6 rounded-lg border border-[#00FF66]/30 bg-[#14161a] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#292c32] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00FF66]">Active Adjudication</span>
                <h3 className="text-lg font-black text-white">Dispute #{selectedDispute.id.substring(0, 8)}</h3>
                <p className="text-xs text-[#737883]">
                  Match #{selectedDispute.match?.id?.substring(0, 8)} • Prize Pool:{" "}
                  <strong className="text-white">₦{Number(selectedDispute.match?.prizePool || 0).toLocaleString()}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/match/${selectedDispute.match?.id}`}
                  target="_blank"
                  className="rounded-md border border-[#353a42] px-2.5 py-1 text-[10px] font-bold text-[#9ca3af] hover:text-white"
                >
                  Open Match Room ↗
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="size-7 rounded-md bg-[#252830] text-white flex items-center justify-center font-bold hover:bg-[#323640]"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Players & Reported Scores Comparison */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#2a2e38] bg-[#0c0d10] p-4 text-xs">
              <div className="border-r border-[#262930] pr-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#3b82f6]">Creator (Host)</span>
                  <span className="font-mono text-white font-bold">Score: {selectedDispute.match?.creatorReportedScore || "None"}</span>
                </div>
                <p className="mt-1 text-sm font-bold text-white">@{selectedDispute.match?.creator?.username}</p>
                <p className="text-[10px] text-[#666c77]">Platform: {selectedDispute.match?.platform}</p>
                {selectedDispute.creatorReason && (
                  <p className="mt-2 text-[10px] text-[#9ca3af] italic bg-[#15181e] p-2 rounded">
                    &quot;{selectedDispute.creatorReason}&quot;
                  </p>
                )}
              </div>

              <div className="pl-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#ef4444]">Opponent (Challenger)</span>
                  <span className="font-mono text-white font-bold">Score: {selectedDispute.match?.opponentReportedScore || "None"}</span>
                </div>
                <p className="mt-1 text-sm font-bold text-white">@{selectedDispute.match?.opponent?.username || "Waiting"}</p>
                <p className="text-[10px] text-[#666c77]">Format: {selectedDispute.match?.format}</p>
                {selectedDispute.opponentReason && (
                  <p className="mt-2 text-[10px] text-[#9ca3af] italic bg-[#15181e] p-2 rounded">
                    &quot;{selectedDispute.opponentReason}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Cloudinary Proof Gallery Affiliated by Username */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Icon name="camera" size={16} className="text-[#00FF66]" />
                Uploaded Proofs by Player (Cloudinary CDN)
              </h4>

              {/* Creator Proofs */}
              <div className="rounded-lg border border-[#2a2e38] bg-[#0d0f13] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-500" />
                    Proofs submitted by @{selectedDispute.match?.creator?.username}
                  </span>
                  <span className="text-[10px] text-[#6c727f]">
                    {(selectedDispute.creatorEvidenceUrls?.length || 0)} image(s)
                  </span>
                </div>

                {selectedDispute.creatorEvidenceUrls && selectedDispute.creatorEvidenceUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedDispute.creatorEvidenceUrls.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative rounded overflow-hidden border border-[#2e333d] bg-black cursor-pointer group"
                        onClick={() => setActiveImagePreview(url)}
                      >
                        <img src={url} alt={`Creator Proof ${idx + 1}`} className="w-full h-20 object-cover group-hover:scale-105 transition" />
                        <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-mono text-[#00FF66]">
                          Zoom 🔍
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#5d6371] italic">No image proofs uploaded yet by creator.</p>
                )}
              </div>

              {/* Opponent Proofs */}
              <div className="rounded-lg border border-[#2a2e38] bg-[#0d0f13] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    Proofs submitted by @{selectedDispute.match?.opponent?.username}
                  </span>
                  <span className="text-[10px] text-[#6c727f]">
                    {(selectedDispute.opponentEvidenceUrls?.length || 0)} image(s)
                  </span>
                </div>

                {selectedDispute.opponentEvidenceUrls && selectedDispute.opponentEvidenceUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedDispute.opponentEvidenceUrls.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative rounded overflow-hidden border border-[#2e333d] bg-black cursor-pointer group"
                        onClick={() => setActiveImagePreview(url)}
                      >
                        <img src={url} alt={`Opponent Proof ${idx + 1}`} className="w-full h-20 object-cover group-hover:scale-105 transition" />
                        <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-mono text-[#00FF66]">
                          Zoom 🔍
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#5d6371] italic">No image proofs uploaded yet by opponent.</p>
                )}
              </div>

              {/* General or External Evidence Link */}
              {selectedDispute.evidenceUrl && (
                <div className="rounded-lg border border-[#2a2e38] bg-[#0d0f13] p-3 text-xs flex items-center justify-between">
                  <span className="text-[#8e94a0]">External Evidence Link:</span>
                  <a
                    href={selectedDispute.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00FF66] font-bold hover:underline truncate max-w-[280px]"
                  >
                    {selectedDispute.evidenceUrl}
                  </a>
                </div>
              )}
            </div>

            {/* Adjudication Decision Panel */}
            {selectedDispute.status === "RESOLVED" ? (
              <div className="rounded-xl border border-[#00FF66]/30 bg-[#00FF66]/10 p-4 text-center">
                <span className="text-xs font-bold text-[#00FF66] uppercase tracking-wider">Dispute Resolved</span>
                <p className="mt-1 text-xs text-white">
                  Winner: <strong className="text-[#00FF66]">@{selectedDispute.match?.winner?.username}</strong>
                </p>
                <p className="mt-1 text-[10px] text-[#9ca3af]">{selectedDispute.resolutionNotes}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#2a2e38] bg-[#101217] p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Award Match &amp; Release Prize Pool</h4>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                    Arbitration / Resolution Notes
                  </label>
                  <input
                    type="text"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Creator provided valid final whistle screen with 3-1 score"
                    className="w-full h-10 rounded-lg border border-[#2b2e35] bg-[#0c0d10] px-3 text-xs text-white placeholder-[#505561] focus:border-[#00FF66] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Button
                    className="h-11 w-full text-xs font-bold"
                    disabled={resolving || !selectedDispute.match?.creator?.id}
                    onClick={() => handleResolve(selectedDispute.match.creator.id, selectedDispute.match.creator.username)}
                  >
                    Award to @{selectedDispute.match?.creator?.username}
                  </Button>
                  <Button
                    className="h-11 w-full text-xs font-bold"
                    variant="secondary"
                    disabled={resolving || !selectedDispute.match?.opponent?.id}
                    onClick={() => handleResolve(selectedDispute.match.opponent.id, selectedDispute.match.opponent.username)}
                  >
                    Award to @{selectedDispute.match?.opponent?.username}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      {activeImagePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
          onClick={() => setActiveImagePreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-white/20 bg-black p-2" onClick={(e) => e.stopPropagation()}>
            <img src={activeImagePreview} alt="Full Proof" className="max-h-[80vh] w-auto mx-auto object-contain rounded-lg" />
            <div className="mt-3 flex items-center justify-between px-2">
              <a
                href={activeImagePreview}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#00FF66] hover:underline"
              >
                Open Original in Cloudinary ↗
              </a>
              <button
                type="button"
                onClick={() => setActiveImagePreview(null)}
                className="rounded bg-[#282b33] px-3 py-1 text-xs font-bold text-white hover:bg-[#383c47]"
              >
                Close Preview (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
