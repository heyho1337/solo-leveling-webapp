import { Button } from '@/components/ui/Button';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { StarBackground } from '@/components/ui/StarBackground';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <StarBackground />


      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-20 pb-32">
        <SystemFrame
          title="Notification"
          className="max-w-3xl"
        >
          <div className="space-y-12">
            <div className="space-y-4 text-white uppercase font-bold tracking-widest text-lg md:text-xl">
              <p className="leading-relaxed">
                You have acquired the qualifications
                <br />
                to be a <span className="font-black system-text-glow-strong">Player</span>. Will you accept?
              </p>
            </div>

            <div className="flex items-center justify-center gap-12 pt-6">
              <Link title="Register" href="/register">
                <Button variant="outline" className="pointer h-12 border-white text-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                  Register
                </Button>
              </Link>
              <Link title="Login" href="/login">
                <Button variant="outline" className="pointer h-12 border-white text-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </SystemFrame>

        {/* Subtle background glow */}
        <div className="absolute -z-10 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-white/20 text-[10px] font-bold">
        <p>© 2026 heyhodesigns</p>
      </footer>
    </div>
  );
}
