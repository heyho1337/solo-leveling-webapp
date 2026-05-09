"use client";

import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserStats } from "@/type/UserStats";

interface StatusSectionProps {
  stats?: UserStats;
}

const statCards: Array<{ label: string; key: keyof UserStats; color: string }> = [
  { label: "STRENGTH", key: "strength", color: "text-secondary" },
  { label: "SPEED", key: "speed", color: "text-primary" },
  { label: "ENDURANCE", key: "endurance", color: "text-accent" },
  { label: "FLEXIBILITY", key: "flexibility", color: "text-[#f472b6]" },
  { label: "BALANCE", key: "balance", color: "text-[#fbbf24]" },
  { label: "POWER", key: "power", color: "text-success" },
  { label: "STAMINA", key: "stamina", color: "text-[#60a5fa]" },
  { label: "RECOVERY", key: "recovery", color: "text-[#4ade80]" },
  { label: "AURA", key: "aura", color: "text-[#a78bfa]" },
];

export const StatusSection = ({ stats }: StatusSectionProps) => {
  return (
    <section className="statusSection">
      <CardHeader>
        <CardTitle className="text-[20px] font-black uppercase tracking-widest text-white/60">
          Status
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => {
          const value = stats?.[stat.key] ?? 0;

          return (
            <motion.div
              className="grid grid-cols-2 items-center justify-center"
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-[8px] system-text-glow-strong font-black uppercase tracking-[0.2em] text-white/80">
                {stat.label}
              </span>
              <div className="text-[14px] system-text-glow-strong font-black text-white/70">
                {value}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </section>
  );
};
