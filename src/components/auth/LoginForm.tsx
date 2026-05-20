'use client';

import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { SystemAlert } from '@/components/ui/SystemAlert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, resendVerification } from '@/app/actions/auth';
import { getCurrentUser } from '@/app/actions/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [alert, setAlert] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onFormError = (errors: FieldErrors<LoginValues>) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstError = errors[errorKeys[0] as keyof LoginValues]?.message as string | undefined;
      if (firstError) setAlert({ message: firstError, isVisible: true });
    }
  };

  const onSubmit = async (data: LoginValues) => {
    try {
      const loginResult = await loginUser({ usernameOrEmail: data.email, password: data.password });

      if (!loginResult.success) {
        if (loginResult.error === 'EMAIL_NOT_VERIFIED') {
          setUnverifiedEmail(data.email);
          setAlert({
            message: 'YOUR ACCOUNT IS NOT YET VERIFIED. CHECK YOUR EMAIL OR REQUEST A NEW LINK.',
            isVisible: true,
          });
          return;
        }
        throw new Error(loginResult.error);
      }

      // Sync localStorage for client-side axios if it's still used anywhere, 
      // although we should eventually remove it.
      if (loginResult.data.access_token) {
        localStorage.setItem('token', loginResult.data.access_token);
        localStorage.setItem('refreshToken', loginResult.data.refresh_token);
      }

      const userResult = await getCurrentUser();
      if (!userResult.success) throw new Error(userResult.error);
      
      const user = userResult.data;

      if (!user.hasCompletedQuestionnaire) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setAlert({ message: (error.message || 'ACCESS DENIED. INVALID CREDENTIALS.').toUpperCase(), isVisible: true });
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    try {
      const result = await resendVerification(unverifiedEmail);
      if (!result.success) throw new Error(result.error);
      setAlert({ message: 'VERIFICATION LINK RESENT. CHECK YOUR EMAIL.', isVisible: true });
    } catch (error: any) {
      setAlert({ message: (error.message || 'FAILED TO RESEND. TRY AGAIN LATER.').toUpperCase(), isVisible: true });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <SystemAlert
        isVisible={alert.isVisible}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />

      <SystemFrame title="Login" className="max-w-2xl">
        <div className="space-y-8 py-4">
          <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6 max-w-md mx-auto text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-widest">Email</label>
              <input
                {...register('email')}
                className="w-full border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/60 transition-all font-mono text-sm"
                placeholder="HUNTER@SYSTEM.COM"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <input
                {...register('password')}
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
              AWAKEN SYSTEM
            </Button>

            {/* Resend verification prompt — shown only when EMAIL_NOT_VERIFIED */}
            {unverifiedEmail && (
              <div className="border border-[#38bdf8]/30 bg-[#38bdf8]/5 p-4 text-center space-y-3">
                <p className="text-[10px] text-[#38bdf8] uppercase tracking-widest">
                  Verification link not received?
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-[10px] text-white/60 hover:text-white uppercase tracking-widest underline underline-offset-4 transition-colors disabled:opacity-40"
                >
                  {isResending ? 'SENDING...' : 'RESEND VERIFICATION LINK'}
                </button>
              </div>
            )}

            <div className="text-center pt-4">
              <Link href="/register" className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors">
                UNAUTHORIZED PLAYER? REGISTER HERE
              </Link>
            </div>
          </form>
        </div>
      </SystemFrame>
    </>
  );
}
