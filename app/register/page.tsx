import AuthPage from "../components/auth-form";

export const metadata = {
  title: "Create Player Account // efChamps",
  description: "Register your efChamps identity and claim your ₦5,000 first-match credit.",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
