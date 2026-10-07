import AuthPage from "../components/auth-form";

export const metadata = {
  title: "Player Login // efChamps",
  description: "Secure login to access your efChamps esports wallet, open match challenges, and leaderboard ranking.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Player Login // efChamps",
    description: "Access your efChamps wallet, match rooms, and active challenges.",
    url: "/login",
  },
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
