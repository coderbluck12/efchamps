import AuthPage from "../components/auth-form";

export const metadata = {
  title: "Create Player Account // efChamps",
  description: "Register your efChamps esports player profile, choose your gaming console (PS5, Xbox, PC, Mobile), and compete for real cash prizes.",
  alternates: {
    canonical: "/register",
  },
  openGraph: {
    title: "Join efChamps // Register Player Account",
    description: "Start competing in verified eFootball skill challenges with fast bank payouts.",
    url: "/register",
  },
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
