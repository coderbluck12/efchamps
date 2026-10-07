import MatchRoomClient from "./match-room-client";

export const metadata = {
  title: "Match Room // GoalVault",
};

export default async function MatchRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <MatchRoomClient matchId={resolvedParams.id} />;
}
