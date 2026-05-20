'use client';

import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { SystemAlert } from '@/components/ui/SystemAlert';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type?: 'error' | 'success' }>({ message: '', isVisible: false });
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onFormError = (errors: FieldErrors<RegisterValues>) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstError = errors[errorKeys[0] as keyof RegisterValues]?.message as string | undefined;
      if (firstError) {
        setAlert({ message: firstError, isVisible: true });
      }
    }
  };

  const onSubmit = async (data: RegisterValues) => {
    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (!result.success) throw new Error(result.error);

      setIsSuccess(true);
      setAlert({
        message: 'REGISTRATION COMPLETE. AN ACTIVATION LINK HAS BEEN SENT TO YOUR COORDINATES (EMAIL).',
        isVisible: true,
        type: 'success'
      });
    } catch (error: any) {
      setAlert({ message: (error.message || 'REGISTRATION FAILED').toUpperCase(), isVisible: true, type: 'error' });
    }
  };

  return (
    <>
      {/* System Alert for Validations */}
      <SystemAlert
        isVisible={alert.isVisible}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />

      <SystemFrame title="Registration" className="max-w-2xl">
        <div className="space-y-8 py-4">
          {!isSuccess ? (
            <>
              <div className="text-center space-y-2">
                <p className="text-white uppercase font-bold tracking-[0.2em] text-sm">Prepare for awakening. provide your hunter credentials.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6 max-w-md mx-auto text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-widest">Username</label>
                  <input
                    {...register('username')}
                    className="w-full border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/60 transition-all font-mono text-sm"
                    placeholder="SUNGJINWOO"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-widest">Email</label>
                  <input
                    {...register('email')}
                    className="w-full border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/60 transition-all font-mono text-sm"
                    placeholder="HUNTER@SYSTEM.COM"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-widest">Password</label>
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/60 transition-all font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-widest">Confirm Password</label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className="w-full border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/60 transition-all font-mono text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full h-14 border-white text-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  variant="outline"
                >
                  INITIALIZE AWAKENING
                </Button>

                <div className="text-center pt-4">
                  <Link href="/login" className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors">
                    ALREADY AN ACTIVE PLAYER? LOGIN HERE
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-8 py-10">
              <div className="space-y-4">
                <h3 className="text-[#38bdf8] text-xl font-black tracking-[0.3em] uppercase">Status: Pending</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto uppercase">
                  Your registration request has been logged. Check your email for the activation protocol link to begin your journey.
                </p>
              </div>

              <div className="pt-6">
                <Link href="/login">
                  <Button className="border-white border-[1px] text-white bg-transparent hover:bg-white hover:text-black tracking-widest text-xs h-12 px-8">
                    REENTRY TO LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </SystemFrame>
    </>
  );
}
