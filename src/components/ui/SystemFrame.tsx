'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SystemFrameProps {
  children: ReactNode;
  className?: string;
  title?: string;
  theme?: string;
}

export function SystemFrame({ children, className, title }: SystemFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative mx-auto grid w-full max-w-4xl grid-cols-[20px_minmax(0,1fr)_20px] md:grid-cols-[35px_minmax(0,1fr)_35px] grid-rows-[auto_1fr_auto]",
        className
      )}

    >
      {/* TOP: row 1, all columns */}
      <div className="relative z-10 col-start-1 col-span-3 row-start-1 z-40 pointer-events-none flex justify-center">
        <Image
          src="/images/system/top.png"
          alt=""
          width={1200}
          height={32}
          className="h-8 w-full max-w-3xl object-fill"
        />
      </div>

      {/* CONTENT: row 2, all columns */}
      <div className="pt-[30px] col-start-1 col-span-3 row-start-2 z-20 relative overflow-hidden shadow-2xl">
        {/* bg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/system/bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="h-full w-full object-cover opacity-60"
          />
        </div>

        {title && (
          <div className="relative z-10 flex items-center justify-center gap-4 px-4 py-8">
            <div className="flex h-12 w-12 items-center justify-center border border-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xl font-bold text-white">
                <span className="system-text-glow-strong">!</span>
              </div>
            </div>

            <div className="flex h-12 items-center justify-center border border-white px-8">
              <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white">
                {title}
              </h2>
            </div>
          </div>
        )}

        <div className="relative z-10 px-4 md:px-12 pt-12 pb-[60px] md:pb-16 md:pt-4 text-center">
          {children}
        </div>

      </div>

      {/* BOTTOM: row 3, all columns */}
      <div className="col-start-1 col-span-3 row-start-3 z-40 pointer-events-none flex justify-center">
        <Image
          src="/images/system/bottom.png"
          alt=""
          width={1200}
          height={32}
          className="h-8 w-full max-w-3xl object-fill"
        />
      </div>

      {/* LEFT: all rows, col 1 */}
      <div className="col-start-1 row-start-1 row-span-3 z-30 pointer-events-none">
        <Image
          src="/images/system/left2.png"
          alt=""
          width={400}
          height={800}
          className="-rotate-[2deg] -translate-x-[5px] h-full w-full object-fill"
        />
      </div>

      {/* RIGHT: all rows, col 3 */}
      <div className="col-start-3 row-start-1 row-span-3 z-30 pointer-events-none">
        <Image
          src="/images/system/right.png"
          alt=""
          width={400}
          height={800}
          className="rotate-[2deg] translate-x-[10px] h-full w-full object-fill"
        />
      </div>
    </motion.div>

  );
}
