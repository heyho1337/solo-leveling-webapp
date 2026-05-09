import { VerifyForm } from '@/components/auth/VerifyForm';
import { StarBackground } from '@/components/ui/StarBackground';
import { Suspense } from 'react';

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <StarBackground />
      <main className="relative z-10 w-full flex justify-center px-4">
        <Suspense fallback={<div>Loading system...</div>}>
          <VerifyForm />
        </Suspense>
      </main>
      <footer className="relative z-10 py-12 text-center text-white/20 text-[10px] font-bold">
        <p>© 2026 Solo Leveling Fitness System. All rights reserved.</p>
      </footer>
    </div>
  );
}
