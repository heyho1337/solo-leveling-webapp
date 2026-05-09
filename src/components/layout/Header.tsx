import { HeaderPropsInterface } from '@/Interface/dashboard/HeaderPropsInterface';

export function Header({ user }: HeaderPropsInterface) {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-panel/10 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold leading-none mb-1">Rank</span>
          <span className="text-xl font-black text-accent drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
            {user?.level?.rank ?? ''}
          </span>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold leading-none mb-1">Level</span>
          <span className="text-xl font-black text-primary drop-shadow-[0_0_10px_rgba(109,40,217,0.4)]">
            {user?.level?.currentLevel ?? ''}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-white">
            {user?.username ?? 'System User'}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black">
            {user?.assignedClassName ?? ''}
          </p>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 p-0.5 shadow-[0_0_15px_rgba(109,40,217,0.2)]">
          <div className="h-full w-full rounded-full bg-panel flex items-center justify-center font-bold text-xs uppercase text-white">
            {user?.username?.substring(0, 2) ?? '??'}
          </div>
        </div>
      </div>
    </header>
  );
}
