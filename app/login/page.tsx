import AuthPage from "../components/auth-form";

export const metadata = {
  title: "Player Login // GoalVault",
  description: "Secure login to access your GoalVault stakes, wallet, and matches.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
