import AuthPage from "../components/auth-form";

export const metadata = {
  title: "Player Login // efChamps",
  description: "Secure login to access your efChamps stakes, wallet, and matches.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
