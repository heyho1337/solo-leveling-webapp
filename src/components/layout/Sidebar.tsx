"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Dumbbell,
  ScrollText,
  ShieldAlert,
  Backpack,
  Trophy,
  Users,
  Store,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Exercises', href: '/exercises', icon: ShieldAlert },
  { name: 'Quests', href: '/quests', icon: ScrollText },
  { name: 'Gates', href: '/gates', icon: ShieldAlert },
  { name: 'Inventory', href: '/inventory', icon: Backpack },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Guilds', href: '/guilds', icon: Users },
  { name: 'Shop', href: '/shop', icon: Store },
  { name: 'Social', href: '/social', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col">
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              <item.icon className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_8px_rgba(109,40,217,0.6)]')} />
              <span className="font-medium tracking-wide uppercase text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary/60 hover:text-secondary hover:bg-secondary/10 transition-all duration-200">
          <LogOut className="h-5 w-5" />
          <span className="font-medium tracking-wide uppercase text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
