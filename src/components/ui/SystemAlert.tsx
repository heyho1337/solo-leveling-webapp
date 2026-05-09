'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SystemAlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'success' | 'info';
}

export function SystemAlert({ message, isVisible, onClose, type = 'error' }: SystemAlertProps) {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (alertRef.current && !alertRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use mousedown instead of click to prevent issues with drag-to-select closing the alert
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-2xl px-4 pointer-events-none"
        >
          {/* Main RPG Alert Modal - 2x2 Grid for Overlap as requested */}
          <div
            ref={alertRef}
            className="relative pointer-events-auto w-full grid grid-cols-[1fr_1fr] grid-rows-[1fr_1fr] rounded-sm ring-1 ring-sky-300/30 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          >

            {/* BACKGROUND LAYER - Spans everything 1-3 1-3 for overlap */}
            <div
              className="backdrop-blur-[59px] opacity-[0.95] col-start-1 col-end-3 row-start-1 row-end-3 z-0 backdrop-blur-xl h-full w-full"
              style={{
                background: 'radial-gradient(circle at center, rgba(30, 58, 138, 0.8) 0%, rgba(2, 6, 23, 0.8) 100%)',
                minHeight: '240px' // Much smaller height
              }}
            />

            {/* CONTENT LAYER - Spans everything 1-3 1-3 for true overlap with corners */}
            <div className="col-start-1 col-end-3 row-start-1 row-end-3 z-10 flex flex-col items-center justify-center p-8">
              <div className="relative w-full flex flex-col items-center max-w-[80%]">
                {/* Crown sits on the TOP border */}
                <div className="absolute top-[38px] w-[130%] h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent z-10" />

                <div className="pt-2 z-20">
                  <svg width="64" height="24" viewBox="0 0 64 24" fill="none" className="text-sky-300 drop-shadow-[0_0_10px_#38bdf8]">
                    <path d="M32 0C35 4 40 6 48 6C42 6 36 10 36 18H28C28 10 22 6 16 6C24 6 29 4 32 0Z" fill="currentColor" fillOpacity="0.8" />
                    <circle cx="32" cy="18" r="2" fill="white" />
                    <path d="M26 12L32 6L38 12L32 18L26 12Z" fill="#020617" opacity="0.6" />
                  </svg>
                </div>

                <div className="flex items-center gap-3 py-6 z-10">
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-black shadow-[0_0_12px_rgba(56,189,248,0.6)]">!</div>
                  <h3 className="text-white text-2xl">Alert</h3>
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-black shadow-[0_0_12px_rgba(56,189,248,0.6)]">!</div>
                </div>

                <div className="w-[130%] h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent z-10" />
              </div>

              <div className="w-full text-center mt-4 mb-8">
                <p className="text-2xl font-bold tracking-[.1em] text-white italic">
                  <span className="text-white system-text-glow-strong mr-4">[</span>
                  <span className={cn(
                    "system-text-glow-strong",
                    type === 'error' ? "text-white" : "text-sky-300"
                  )}>
                    {message}
                  </span>
                  <span className="text-white system-text-glow-strong ml-4">]</span>
                </p>
              </div>
            </div>

            {/* CORNERS - Mapped to the 4 cells of the 2x2 grid to ensure overlap with spanning content */}
            <div className="col-start-1 row-start-1 z-20 pointer-events-none w-[60px] h-[60px]">
              <OrnamentalCorner className="text-sky-300" orientation="top-left" />
            </div>
            <div className="col-start-2 row-start-1 z-20 pointer-events-none flex justify-end">
              <OrnamentalCorner className="text-sky-300 w-[60px] h-[60px]" orientation="top-right" />
            </div>
            <div className="col-start-1 row-start-2 z-20 pointer-events-none flex items-end">
              <OrnamentalCorner className="text-sky-300 w-[60px] h-[60px]" orientation="bottom-left" />
            </div>
            <div className="col-start-2 row-start-2 z-20 pointer-events-none flex items-end justify-end">
              <OrnamentalCorner className="text-sky-300 w-[60px] h-[60px]" orientation="bottom-right" />
            </div>

            {/* Side Borders */}
            <div className="absolute left-[4px] h-[70%] top-1/2 -translate-y-1/2 w-[1px] bg-sky-300/30 z-20" />
            <div className="absolute right-[4px] h-[70%] top-1/2 -translate-y-1/2 w-[1px] bg-sky-300/30 z-20" />

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-2 right-6 text-white/40 hover:text-white transition-colors z-[100] font-mono text-sm group"
            >
              <span className="group-hover:system-text-glow">- x</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OrnamentalCorner({ className, orientation = 'top-left' }: { className?: string, orientation?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-left': 'rotate-[-90deg]',
    'bottom-right': 'rotate-180',
  }[orientation];

  return (
    <svg viewBox="0 0 50 50" className={cn("w-full h-full", rotation, className)} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2 L48 2 M2 2 L2 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <path d="M6 6 C12 6 14 10 14 14 C14 18 10 20 6 20 C2 20 2 18 2 16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M22 2 C22 8 18 12 12 12" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <path d="M2 22 C8 22 12 18 12 12" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="2" cy="2" r="3.5" fill="currentColor" />
    </svg>
  );
}
