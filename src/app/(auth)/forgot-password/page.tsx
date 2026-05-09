'use client';

import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { StarBackground } from '@/components/ui/StarBackground';
import { SystemAlert } from '@/components/ui/SystemAlert';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const {
    register,
    handleSubmit,
    formState: { isLoading },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onFormError = (errors: FieldErrors<ForgotPasswordValues>) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstError = errors[errorKeys[0] as keyof ForgotPasswordValues]?.message as string | undefined;
      if (firstError) {
        setAlert({ message: firstError, isVisible: true });
      }
    }
  };

  const onSubmit = async (data: ForgotPasswordValues) => {
    console.log('Sending recovery email...', data);
    // Implementation for API call will go here
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-black pb-12">
      <StarBackground />
      
      {/* System Alert for Validations */}
      <SystemAlert 
        isVisible={alert.isVisible} 
        message={alert.message} 
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))} 
      />

      <main className="relative z-10 w-full flex justify-center px-4 pt-20">
        <SystemFrame title="Recovery" className="max-w-2xl">
          <div className="space-y-8 py-4">
            <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6 max-w-md mx-auto text-left">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-widest">Registered Email</label>
                <input
                  {...register('email')}
                  className="w-full border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/60 transition-all font-mono text-sm"
                  placeholder="HUNTER@SYSTEM.COM"
                />
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full h-14 border-white text-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]" variant="outline">
                SEND RECOVERY KEY
              </Button>

              <div className="text-center pt-4">
                <Link href="/login" className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors">
                  LOGIN HERE
                </Link>
              </div>
            </form>
          </div>
        </SystemFrame>
      </main>

      <footer className="relative z-10 py-12 text-center text-white/20 text-[10px] font-bold">
        <p>© 2026 Solo Leveling Fitness System. All rights reserved.</p>
      </footer>
    </div>
  );
}
