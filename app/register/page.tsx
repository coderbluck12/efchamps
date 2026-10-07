import AuthPage from "../components/auth-form";

export const metadata = {
  title: "Create Player Account // efChamps",
  description: "Register your efChamps identity, choose your gaming platform, and enter competitive skill tournaments.",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
