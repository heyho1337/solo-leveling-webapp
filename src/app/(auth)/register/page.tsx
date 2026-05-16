import { RegisterForm } from '@/components/auth/RegisterForm';
import { StarBackground } from '@/components/ui/StarBackground';

export default function RegisterPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden pb-12">
      <StarBackground />

      <main className="relative z-10 w-full flex justify-center px-4 pt-20">
        <RegisterForm />
      </main>

      <footer className="relative z-10 py-12 text-center text-white/20 text-[10px] font-bold">
        <p>© 2026 heyhodesigns</p>
      </footer>
    </div>
  );
}
