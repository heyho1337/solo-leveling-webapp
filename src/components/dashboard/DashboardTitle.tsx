"use client";

import { motion } from "framer-motion";

interface DashboardTitleProps {
  username?: string;
}

export const DashboardTitle = ({ username }: DashboardTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="title flex items-center justify-between [grid-row:1]"
    >
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          {username ? `${username}'s Dashboard` : "Daily Summary"}
        </h2>
      </div>
    </motion.div>
  );
};
