import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Connexion back-office",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-16">
      <LoginForm />
    </div>
  );
}
