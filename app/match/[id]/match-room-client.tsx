"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { Brand, Button, Field, Icon } from "../../components/ui";

export default function MatchRoomClient({ matchId }: { matchId: string }) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [lobbyCode, setLobbyCode] = useState("");
  const [savingCode, setSavingCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [matchDurationMinutes, setMatchDurationMinutes] = useState(6);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submittingOutcome, setSubmittingOutcome] = useState<"WON" | "DRAW" | "LOST" | null>(null);
  const [myGoals, setMyGoals] = useState<string>("1");
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputeEvidence, setDisputeEvidence] = useState<string>("");
  const [disputeFiles, setDisputeFiles] = useState<File[]>([]);
  const [disputeFilePreviews, setDisputeFilePreviews] = useState<string[]>([]);
  const [disputeRules, setDisputeRules] = useState<string>("");
  const [cancellingChallenge, setCancellingChallenge] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).slice(0, 5); // Allow up to 5 screenshots
      setDisputeFiles(filesArray);
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setDisputeFilePreviews(previewUrls);
    }
  };

  const removeFile = (index: number) => {
    setDisputeFiles((prev) => prev.filter((_, i) => i !== index));
    setDisputeFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancelChallenge = async () => {
    if (!confirm(`Are you sure you want to cancel this challenge? Your stake of ₦${Number(match.stakeAmount).toLocaleString()} will be refunded to your wallet immediately.`)) {
      return;
    }
    try {
      setCancellingChallenge(true);
      await api.cancelMatch(match.id);
      await refreshUser();
      alert("Challenge cancelled and your stake has been refunded to your wallet.");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to cancel challenge");
      setCancellingChallenge(false);
    }
  };

  const fetchMatch = () => {
    api.getMatchById(matchId)
      .then((data) => {
        setMatch(data);
        if (data.lobbyCode) setLobbyCode(data.lobbyCode);
        if (data.status === "COMPLETED") {
          refreshUser();
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.getMatchDuration()
      .then((res: any) => {
        if (res?.minutes) setMatchDurationMinutes(Number(res.minutes));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      fetchMatch();
      const interval = setInterval(fetchMatch, 5000);
      return () => clearInterval(interval);
    }
  }, [user, matchId]);

  // Persistent Countdown timer:
  // Timer is strictly calculated from match.startedAt (when opponent joined) or match.createdAt.
  // Refreshing the page does NOT restart the timer because it measures actual time elapsed against the server timestamp.
  useEffect(() => {
    if (!match) return;

    // While match is still waiting for an opponent (OPEN), keep timer at full match duration
    if (match.status === "OPEN" && !match.opponent) {
      setTimeLeft(matchDurationMinutes * 60);
      return;
    }

    // Anchor time: use match.startedAt (when opponent joined), fallback to match.createdAt
    const anchorTimeString = match.startedAt || match.createdAt;
    const startTime = anchorTimeString ? new Date(anchorTimeString).getTime() : Date.now();
    const durationMs = matchDurationMinutes * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remainingSeconds = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
      setTimeLeft(remainingSeconds);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [match?.status, match?.startedAt, match?.createdAt, matchDurationMinutes]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0D10]">
        <p className="text-[#00FF66]">Loading match details...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0C0D10] text-white">
        <p className="mb-4">Match not found.</p>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isCreator = match.creator?.id === user?.id;
  const isOpponent = match.opponent?.id === user?.id;
  const isParticipant = isCreator || isOpponent;
  const mySubmittedScore = isCreator ? match.creatorReportedScore : match.opponentReportedScore;

  // 1. PREVIEW / JOIN UI
  if (!isParticipant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0D10] p-6 text-white relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="w-full max-w-lg rounded-2xl border border-[#292c32] bg-[#14161a] p-8 shadow-2xl relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-black">Challenge Details</h1>
            <Link href="/dashboard" className="text-[#6c727f] hover:text-white"><Icon name="arrow" size={20} className="rotate-180" /></Link>
          </div>
          
          <div className="mb-8 rounded-lg border border-[#30333a] bg-[#0f1114] p-5">
            <div className="flex items-center gap-4 border-b border-[#292c32] pb-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#60a5fa] text-sm font-black text-white">
                {match.creator?.username?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold">{match.creator?.username}</h3>
                <p className="text-xs text-[#676c77]">Win Rate: {match.creator?.winRate || "0"}% • {match.creator?.matchesPlayed || 0} Matches</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5f646e]">Stake Amount</p>
                <p className="mt-1 text-xl font-black text-white">₦{Number(match.stakeAmount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5f646e]">Prize Pool</p>
                <p className="mt-1 text-xl font-black text-[#00FF66]">₦{Number(match.prizePool).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5f646e]">Platform</p>
                <p className="mt-1 text-sm font-semibold text-white">{match.platform}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5f646e]">Format</p>
                <p className="mt-1 text-sm font-semibold text-white">{match.format}</p>
              </div>
            </div>
          </div>

          <Button
            className="h-14 w-full text-sm"
            onClick={async () => {
              setJoining(true);
              try {
                await api.acceptMatch(match.id);
                fetchMatch();
              } catch (e: any) {
                alert(e.message || "Failed to join challenge");
                setJoining(false);
              }
            }}
            disabled={joining || match.status !== "OPEN"}
          >
            {joining ? "Joining..." : match.status !== "OPEN" ? "Challenge no longer available" : "Accept Challenge & Pay Stake"}
          </Button>
        </div>
      </div>
    );
  }

  // 2. MATCH ROOM UI
  const handleSaveCode = async () => {
    if (!lobbyCode.trim()) {
      alert("Please enter a lobby code");
      return;
    }
    setSavingCode(true);
    try {
      await api.setLobbyCode(match.id, lobbyCode);
      alert("Lobby code saved and shared!");
      fetchMatch();
    } catch (e: any) {
      alert(e.message || "Failed to save lobby code");
    } finally {
      setSavingCode(false);
    }
  };

  // User inputs their own score and selects WON, DRAW, or LOST
  const handleReportOutcome = async (outcome: "WON" | "DRAW" | "LOST") => {
    const goals = Math.max(0, parseInt(myGoals) || 0);
    setSubmittingOutcome(outcome);
    try {
      // Format as "goals:OUTCOME" e.g. "3:WON" or "1:DRAW"
      const scorePayload = `${goals}:${outcome}`;
      await api.submitScore(match.id, scorePayload, outcome);
      fetchMatch();
    } catch (e: any) {
      alert(e.message || "Failed to submit match result");
    } finally {
      setSubmittingOutcome(null);
    }
  };

  const handleRaiseDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert("Please provide an explanation / summary for the dispute");
      return;
    }
    setSubmittingDispute(true);
    try {
      if (disputeFiles.length > 0) {
        await api.uploadEvidence(match.id, disputeFiles, disputeReason);
      } else {
        await api.disputeMatch(match.id, disputeReason, disputeEvidence);
      }
      alert("Dispute proof submitted successfully! The admin has been notified with your username and uploaded proof.");
      setDisputeFiles([]);
      setDisputeFilePreviews([]);
      fetchMatch();
    } catch (e: any) {
      alert(e.message || "Failed to report dispute");
    } finally {
      setSubmittingDispute(false);
    }
  };

  const formatTimer = (totalSeconds: number | null) => {
    if (totalSeconds === null) return "06:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const isTimerFinished = timeLeft !== null && timeLeft <= 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#0C0D10] text-white">
      <header className="flex h-16 items-center justify-between border-b border-[#292c32] bg-[#14161a] px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="text-[#6c727f] hover:text-white">
            <Icon name="arrow" size={18} className="rotate-180" />
          </Link>
          <Brand />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {isCreator && match.status === "OPEN" && !match.opponent && (
            <button
              type="button"
              onClick={handleCancelChallenge}
              disabled={cancellingChallenge}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
            >
              {cancellingChallenge ? "Cancelling..." : "Cancel Challenge"}
            </button>
          )}
          <div className="rounded-full border border-[#00FF66]/20 bg-[#00FF66]/10 px-2.5 sm:px-4 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#00FF66]">
            {match.status}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Official Match Room</h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#737883]">
                Communicate, track progress, and submit results securely.
              </p>
            </div>
            {isCreator && match.status === "OPEN" && !match.opponent && (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3.5 text-xs">
                <span className="font-bold text-yellow-400">Waiting for Opponent</span>
                <p className="text-[11px] text-[#9ca3af] mt-1">
                  You can cancel this open challenge at any time before an opponent joins to immediately reclaim your ₦{Number(match.stakeAmount).toLocaleString()} stake.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Versus Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-[#292c32] bg-[#14161a] p-5 sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-red-900/10 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="text-center min-w-[70px]">
                    <div className="mx-auto flex size-12 sm:size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-base sm:text-xl font-black shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                      {match.creator?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold truncate max-w-[85px] sm:max-w-none">{match.creator?.username}</h3>
                    <p className="text-[9px] sm:text-[10px] text-[#737883]">Creator</p>
                  </div>
                  
                  <div className="text-center px-2">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF66]">Prize Pool</p>
                    <p className="text-xl sm:text-3xl font-black text-white">₦{Number(match.prizePool).toLocaleString()}</p>
                    <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-black italic text-[#4b4e54]">VS</div>
                  </div>

                  <div className="text-center min-w-[70px]">
                    <div className="mx-auto flex size-12 sm:size-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 text-base sm:text-xl font-black shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                      {match.opponent?.username?.substring(0, 2).toUpperCase() || "?"}
                    </div>
                    <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold truncate max-w-[85px] sm:max-w-none">{match.opponent?.username || "Waiting..."}</h3>
                    <p className="text-[9px] sm:text-[10px] text-[#737883]">Opponent</p>
                  </div>
                </div>
              </div>

              {/* Lobby Code Section */}
              <div className="relative overflow-hidden rounded-2xl border border-[#2b2f38] bg-gradient-to-b from-[#16181e] to-[#111317] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FF66]/40 to-transparent" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#00FF66]/10 text-[#00FF66]">
                      <Icon name="controller" size={15} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Console Lobby Code</h3>
                  </div>
                  {match.lobbyCode ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 px-3 py-1 text-[10px] font-black text-[#00FF66]">
                      <span className="size-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                      Active In-Game Code
                    </span>
                  ) : (
                    <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[9px] font-bold text-yellow-400">
                      Awaiting Code
                    </span>
                  )}
                </div>
                <p className="mb-5 text-xs leading-relaxed text-[#858b98]">
                  {isCreator
                    ? "As the challenge host, generate or enter your console/in-game room invite code below so your opponent can join."
                    : "The challenge creator will generate the console room invite code. Once published, copy it to connect directly in-game."}
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  {isCreator ? (
                    <>
                      <div className="relative flex-1">
                        <input
                          className="h-13 w-full rounded-xl border border-[#323640] bg-[#090a0d] px-4 font-mono text-sm tracking-wider text-white placeholder-[#505561] transition-all duration-200 focus:border-[#00FF66] focus:bg-[#0c0e12] focus:shadow-[0_0_20px_rgba(0,255,102,0.15)] focus:outline-none"
                          placeholder="e.g. 8492-482-11 or Room #401"
                          value={lobbyCode}
                          onChange={(e) => setLobbyCode(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveCode}
                        disabled={savingCode || !lobbyCode.trim()}
                        className="group relative flex h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#00d957] px-6 text-xs font-black tracking-wider uppercase text-[#06150c] shadow-[0_0_25px_rgba(0,255,102,0.25)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_35px_rgba(0,255,102,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                      >
                        {savingCode ? (
                          <>
                            <span className="size-3.5 animate-spin rounded-full border-2 border-[#06150c] border-t-transparent" />
                            <span>Sharing...</span>
                          </>
                        ) : (
                          <>
                            <Icon name="bolt" size={15} />
                            <span>Share Code</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="relative flex-1">
                        <input
                          className="h-13 w-full rounded-xl border border-[#2b2f38] bg-[#090a0d] px-4 font-mono text-base font-bold tracking-widest text-[#00FF66] placeholder-[#505561] select-all cursor-pointer focus:outline-none"
                          readOnly
                          placeholder="Waiting for creator to publish lobby code..."
                          value={lobbyCode}
                        />
                        {lobbyCode && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded bg-[#00FF66]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#00FF66]">
                            READY
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (lobbyCode) {
                            navigator.clipboard.writeText(lobbyCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2500);
                          }
                        }}
                        disabled={!lobbyCode}
                        className={`group relative flex h-13 shrink-0 items-center justify-center gap-2 rounded-xl border px-6 text-xs font-black tracking-wider uppercase transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                          copied
                            ? "border-[#00FF66] bg-[#00FF66] text-[#06150c] shadow-[0_0_25px_rgba(0,255,102,0.35)]"
                            : "border-[#383d47] bg-[#1a1d24] text-white hover:border-[#00FF66]/60 hover:bg-[#20242c] hover:text-[#00FF66] hover:shadow-[0_0_20px_rgba(0,255,102,0.12)]"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Icon name="check" size={16} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="size-4 shrink-0 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Match Rules & Settings */}
              <div className="rounded-2xl border border-[#292c32] bg-[#14161a] p-6">
                 <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-[#292c32] pb-4">Match Settings</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5">
                    <div>
                      <p className="text-[10px] text-[#737883] uppercase tracking-wider">Platform</p>
                      <p className="mt-1 font-bold text-white">{match.platform}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#737883] uppercase tracking-wider">Format</p>
                      <p className="mt-1 font-bold text-white">{match.format}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#737883] uppercase tracking-wider">Team Rules</p>
                      <p className="mt-1 font-bold text-white">{match.teamRules}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#737883] uppercase tracking-wider">Stake (Each)</p>
                      <p className="mt-1 font-bold text-white">₦{Number(match.stakeAmount).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Sidebar Tools (Timer & Reporting) */}
            <div className="space-y-6">
              {/* Timer */}
              <div className="rounded-2xl border border-[#00FF66]/20 bg-[#14161a] p-6 text-center shadow-[0_0_30px_rgba(0,255,102,0.05)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF66]">Time to complete</p>
                <div className="mt-3 text-5xl font-black tracking-[-0.05em] text-white">
                  {formatTimer(timeLeft)}
                </div>
                <p className="mt-2 text-xs text-[#737883]">
                  {isTimerFinished
                    ? "Time has completed! You may now submit your final match score."
                    : `Matches must be played. Result reporting unlocks in ${formatTimer(timeLeft)}.`}
                </p>
              </div>

              {/* Score Reporting */}
              <div className="rounded-2xl border border-[#292c32] bg-[#14161a] p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Report Match Score</h3>
                  {mySubmittedScore && (
                    <span className="rounded bg-[#00FF66]/10 px-2 py-0.5 text-[9px] font-bold text-[#00FF66]">
                      Score Reported: {mySubmittedScore}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#737883] mb-5">
                  Enter the exact goals scored by each player. Both players must report the score to verify and release the prize pool.
                </p>

                {match.status === "COMPLETED" ? (() => {
                  // Determine winner accurately: check match.winner object, or parse reported scores
                  let winnerName = match.winner?.username;
                  if (!winnerName && match.creatorReportedScore) {
                    const cStr = match.creatorReportedScore;
                    const oStr = match.opponentReportedScore || "";
                    if (cStr.includes("WON") || oStr.includes("LOST")) winnerName = match.creator?.username;
                    else if (cStr.includes("LOST") || oStr.includes("WON")) winnerName = match.opponent?.username;
                    else if (cStr.includes("-")) {
                      const [c1, c2] = cStr.split("-").map(Number);
                      if (c1 > c2) winnerName = match.creator?.username;
                      else if (c2 > c1) winnerName = match.opponent?.username;
                    }
                  }

                  const isCurrentUserWinner = winnerName && winnerName === user?.username;

                  return (
                    <div className="rounded-xl border border-[#00FF66]/30 bg-gradient-to-b from-[#142319] to-[#0f1712] p-6 text-center shadow-[0_0_30px_rgba(0,255,102,0.1)]">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#00FF66]/20 text-[#00FF66] mb-3">
                        <Icon name="crown" size={24} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF66]">Match Finalized</p>
                      <h4 className="mt-2 text-xl font-black text-white">
                        {winnerName ? (
                          isCurrentUserWinner ? (
                            <span className="text-[#00FF66]">🎉 You Won the Match!</span>
                          ) : (
                            <span>Winner: <span className="text-[#00FF66]">{winnerName}</span></span>
                          )
                        ) : (
                          <span>Draw (Stake Refunded)</span>
                        )}
                      </h4>
                      {winnerName && (
                        <p className="mt-1 text-xs font-semibold text-[#858a95]">
                          Prize pool of <span className="text-[#00FF66] font-bold">₦{Number(match.prizePool).toLocaleString()}</span> has been credited to {winnerName}&apos;s wallet.
                        </p>
                      )}
                      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#26352b] bg-[#0c120e] px-4 py-1.5 font-mono text-xs font-bold text-white">
                        <span>Score: {match.creatorReportedScore || "Finalized"}</span>
                      </div>
                    </div>
                  );
                })() : match.status === "DISPUTED" ? (
                  /* Dedicated Dispute UI */
                  <div className="rounded-xl border border-red-500/40 bg-gradient-to-b from-[#1c1214] to-[#140e10] p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                    <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                        <Icon name="headset" size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Score Conflict In Review</h4>
                        <p className="text-[10px] text-red-400">Scores entered by both players did not match</p>
                      </div>
                    </div>

                    <div className="my-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9ca3af]">Creator ({match.creator?.username}):</span>
                        <span className="font-bold text-white">{match.creatorReportedScore || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9ca3af]">Opponent ({match.opponent?.username || "N/A"}):</span>
                        <span className="font-bold text-white">{match.opponentReportedScore || "N/A"}</span>
                      </div>
                    </div>

                    {/* Admin Defined Dispute Acceptance Guidelines */}
                    <div className="mb-4 rounded-lg border border-[#30343f] bg-[#0d0f13] p-4 text-xs">
                      <div className="flex items-center gap-2 mb-1 text-[#00FF66]">
                        <Icon name="shield" size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Official Evidence Rules &amp; Requirements</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#9ca3af]">
                        {disputeRules || "Upload clear, uncropped in-game final whistle screenshots or full video proof displaying the final score, both players' IDs/Gamertags, and post-match summary stats. Altered or cropped images are rejected."}
                      </p>
                      <p className="mt-2 text-[10px] text-[#636873]">
                        Your uploaded proofs will be permanently watermarked with your username (<strong className="text-white">@{user?.username}</strong>) for administrative arbitrament.
                      </p>
                    </div>

                    <p className="text-xs leading-relaxed text-[#9ca3af] mb-4">
                      Escrow funds (<span className="text-white font-bold">₦{Number(match.prizePool).toLocaleString()}</span>) are frozen safely. Provide your match proof below for the admin to inspect and award the prize.
                    </p>

                    <form onSubmit={handleRaiseDispute} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                          Dispute Explanation / Match Summary
                        </label>
                        <textarea
                          rows={3}
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          placeholder="Describe what occurred (e.g. Opponent disconnected at 85', final score was 3-1)"
                          className="w-full rounded-xl border border-[#373b45] bg-[#0c0d10] p-3 text-xs text-white placeholder-[#5d6371] focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {/* Multiple Image Upload via Cloudinary */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">
                            Upload Screenshot Proofs (Up to 5 images)
                          </label>
                          <span className="text-[10px] text-[#00FF66] font-bold">via Cloudinary Secure Storage</span>
                        </div>

                        <div className="relative mt-1">
                          <label className="flex flex-col items-center justify-center w-full min-h-[90px] border-2 border-dashed border-[#343842] hover:border-[#00FF66]/50 rounded-xl cursor-pointer bg-[#090a0d] hover:bg-[#0d0f14] transition p-4 text-center">
                            <Icon name="camera" size={24} className="text-[#646a78] mb-1.5" />
                            <span className="text-xs font-bold text-white">Click to Select or Drag &amp; Drop Proof Screenshots</span>
                            <span className="text-[10px] text-[#6e7482] mt-0.5">JPG, PNG, WEBP (Max 5 images)</span>
                            <input
                              type="file"
                              multiple
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>

                        {/* Image Previews */}
                        {disputeFilePreviews.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {disputeFilePreviews.map((previewUrl, index) => (
                              <div key={index} className="relative rounded-lg overflow-hidden border border-[#2e323b] bg-black group">
                                <img
                                  src={previewUrl}
                                  alt={`Proof ${index + 1}`}
                                  className="w-full h-24 object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-mono text-[#00FF66]">
                                  Proof #{index + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute top-1 right-1 size-5 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center text-xs font-black"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                          Video Recording / External Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={disputeEvidence}
                          onChange={(e) => setDisputeEvidence(e.target.value)}
                          placeholder="https://youtu.be/... or Google Drive video link"
                          className="w-full h-11 rounded-xl border border-[#373b45] bg-[#0c0d10] px-3 text-xs text-white placeholder-[#5d6371] focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingDispute}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs uppercase tracking-wider text-white transition active:scale-[0.98] disabled:opacity-50"
                      >
                        {submittingDispute ? "Uploading Proof to Cloudinary..." : `Submit Proof as @${user?.username}`}
                      </button>
                    </form>
                  </div>
                ) : !isTimerFinished ? (
                  /* Locked state until timer runs down */
                  <div className="rounded-xl border border-[#2b2e35] bg-[#0c0d10] p-6 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white/5 text-[#737883] mb-3">
                      <Icon name="lock" size={18} />
                    </div>
                    <p className="text-xs font-bold text-white">Result Reporting Locked</p>
                    <p className="mt-1.5 text-[10px] leading-4 text-[#737883]">
                      Play your match now. The score input box and result buttons will automatically reveal once the {matchDurationMinutes}-minute match timer completes.
                    </p>
                  </div>
                ) : (
                  /* Revealed state when timer finishes */
                  <div className="space-y-5">
                    {/* Single Goal Input Box */}
                    <div className="rounded-xl border border-[#2a2d34] bg-[#0c0d10] p-5 text-center">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#858a95] mb-2">
                        Enter Your Total Goals Scored
                      </label>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMyGoals(String(Math.max(0, (parseInt(myGoals) || 0) - 1)))}
                          className="size-11 flex items-center justify-center rounded-xl border border-[#323640] bg-[#14161a] text-lg font-bold text-white hover:border-[#00FF66] active:scale-95"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={myGoals}
                          onChange={(e) => setMyGoals(e.target.value)}
                          className="size-16 rounded-xl border border-[#383d47] bg-[#14161a] text-center text-3xl font-black text-[#00FF66] focus:border-[#00FF66] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setMyGoals(String((parseInt(myGoals) || 0) + 1))}
                          className="size-11 flex items-center justify-center rounded-xl border border-[#323640] bg-[#14161a] text-lg font-bold text-white hover:border-[#00FF66] active:scale-95"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-2 text-[10px] text-[#636872]">
                        Type or adjust how many goals you scored in the game.
                      </p>
                    </div>

                    {/* Outcome Buttons with Individual Loading States */}
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#858a95]">
                        Select Your Match Result
                      </p>
                      
                      <button
                        type="button"
                        disabled={submittingOutcome !== null}
                        onClick={() => handleReportOutcome("WON")}
                        className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 font-black text-xs uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        {submittingOutcome === "WON" ? (
                          <>
                            <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Submitting Win ({myGoals} Goals)...</span>
                          </>
                        ) : (
                          <span>I Won ({myGoals} Goals)</span>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={submittingOutcome !== null}
                        onClick={() => handleReportOutcome("DRAW")}
                        className="w-full flex h-12 items-center justify-center gap-2 rounded-xl border border-[#383d47] bg-[#1a1d24] font-black text-xs uppercase tracking-wider text-[#9ca3af] hover:border-[#00FF66]/50 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {submittingOutcome === "DRAW" ? (
                          <>
                            <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Submitting Draw ({myGoals} Goals)...</span>
                          </>
                        ) : (
                          <span>Draw / Tie ({myGoals} Goals)</span>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={submittingOutcome !== null}
                        onClick={() => handleReportOutcome("LOST")}
                        className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 font-black text-xs uppercase tracking-wider text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        {submittingOutcome === "LOST" ? (
                          <>
                            <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Submitting Loss ({myGoals} Goals)...</span>
                          </>
                        ) : (
                          <span>I Lost ({myGoals} Goals)</span>
                        )}
                      </button>
                    </div>

                    {/* Live Progress indicator */}
                    <div className="border-t border-[#272a2f] pt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#858a95]">Creator ({match.creator?.username}):</span>
                        <span className={match.creatorReportedScore ? "font-bold text-[#00FF66]" : "text-yellow-400"}>
                          {match.creatorReportedScore ? `Submitted (${match.creatorReportedScore})` : "Pending input..."}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#858a95]">Opponent ({match.opponent?.username || "Awaiting"}):</span>
                        <span className={match.opponentReportedScore ? "font-bold text-[#00FF66]" : "text-yellow-400"}>
                          {match.opponentReportedScore ? `Submitted (${match.opponentReportedScore})` : "Pending input..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
