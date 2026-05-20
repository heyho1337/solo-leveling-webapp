'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyUser } from '@/app/actions/auth';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { Button } from '@/components/ui/Button';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Initializing verification protocol...');
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      queueMicrotask(() => {
        setStatus('error');
        setMessage('MISSING IDENTIFIER. ACCESS DENIED.');
      });
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyUser(token);
        if (!result.success) throw new Error(result.error);
        
        setStatus('success');
        setMessage('AUTHENTICATION SUCCESSFUL. IDENTITY VERIFIED.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'VERIFICATION FAILED. TOKEN EXPIRED OR INVALID.');
      }
    };

    void verify();
  }, [searchParams]);

  useEffect(() => {
    if (status !== 'success') return;

    const countdown = window.setInterval(() => {
      setRedirectCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    const timeout = window.setTimeout(() => {
      // Automatic redirect removed to allow user to see success message
    }, 2500);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(timeout);
    };
  }, [status, router]);

  return (
    <SystemFrame title="System Verification" className="max-w-xl">
      <div className="space-y-8 py-10 text-center">
        <div className="space-y-4">
          <h3 className={`text-xl font-black tracking-[0.3em] uppercase ${status === 'error' ? 'text-red-500' : 'text-[#38bdf8]'}`}>
            {status === 'verifying' ? 'Processing...' : status === 'success' ? 'Verified' : 'Failed'}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto uppercase">
            {message}
          </p>
        </div>

        {status === 'success' && (
          <div className="pt-6 animate-pulse space-y-4">
            <p className="text-[#38bdf8] text-[10px] tracking-[0.4em] mb-4 uppercase">
              Identity Verified. Please sign in to initialize System.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="border-white bg-transparent text-white border-[1px] hover:bg-[#38bdf8] hover:text-black tracking-widest text-xs h-12 px-8"
            >
              PROCEED TO LOGIN
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="pt-6 space-y-4">
            <p className="text-white/60 text-xs uppercase tracking-[0.2em]">
              If your token has expired, log in and request a new verification link.
            </p>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black tracking-widest text-xs h-12 px-8"
            >
              GO TO LOGIN
            </Button>
          </div>
        )}
      </div>
    </SystemFrame>
  );
}

export function VerifyForm() {
  return (
    <Suspense fallback={<div>Loading system...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
