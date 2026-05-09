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
import { authService } from '@/services/authService';
import api from '@/services/api';

type ApiResponseError = {
  response?: {
    data?: {
      message?: string;
      'hydra:description'?: string;
    };
  };
};

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
      await authService.login({ usernameOrEmail: data.email, password: data.password });

      const meResponse = await api.get('/users/me');
      const user = meResponse.data;

      if (!user.hasCompletedQuestionnaire) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      const apiError = error as any;
      let description = 'ACCESS DENIED. INVALID CREDENTIALS.';

      if (apiError.response?.data?.message === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(data.email);
        setAlert({
          message: 'YOUR ACCOUNT IS NOT YET VERIFIED. CHECK YOUR EMAIL OR REQUEST A NEW LINK.',
          isVisible: true,
        });
        return;
      }

      if (apiError.response?.data?.violations?.[0]?.message) {
        description = apiError.response.data.violations[0].message;
      } else if (apiError.response?.data?.detail) {
        description = apiError.response.data.detail;
      } else if (apiError.response?.data?.description) {
        description = apiError.response.data.description;
      } else if (apiError.response?.data?.message) {
        description = apiError.response.data.message;
      } else if (apiError.response?.data?.['hydra:description']) {
        description = apiError.response.data['hydra:description'];
      }

      setAlert({ message: description.toUpperCase(), isVisible: true });
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    try {
      await authService.resendVerification(unverifiedEmail);
      setAlert({ message: 'VERIFICATION LINK RESENT. CHECK YOUR EMAIL.', isVisible: true });
    } catch {
      setAlert({ message: 'FAILED TO RESEND. TRY AGAIN LATER.', isVisible: true });
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
