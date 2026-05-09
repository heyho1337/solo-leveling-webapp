'use client';

import { useState, useEffect } from 'react';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface HiddenClassOffer {
  id: string;
  name: string;
  description: string;
  ability: string;
  multiplier: string;
}

interface ClassChangeModalProps {
  offer: HiddenClassOffer | null;
  onAccept: (classId: string) => void;
  onDecline: () => void;
}

export function ClassChangeModal({ offer, onAccept, onDecline }: ClassChangeModalProps) {
  if (!offer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg"
        >
          <SystemFrame title="SYSTEM ALERT: JOB CHANGE OFFER" theme="warning">
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <h2 className="text-[#38bdf8] text-2xl font-black uppercase tracking-[0.2em] animate-pulse">
                  {offer.name}
                </h2>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">
                  Unique Class Evolution Detected
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 space-y-4 rounded">
                <div className="space-y-1">
                  <span className="text-[#38bdf8] text-[10px] font-bold uppercase tracking-widest">Ability</span>
                  <p className="text-white text-xs leading-relaxed uppercase">{offer.ability}</p>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="space-y-1">
                    <span className="text-[#38bdf8] text-[10px] font-bold uppercase tracking-widest">Multiplier</span>
                    <p className="text-white font-black">{offer.multiplier}x</p>
                  </div>
                  <div className="text-right">
                    <span className="text-white/20 text-[8px] uppercase tracking-widest block">Rank</span>
                    <span className="text-[#38bdf8] font-bold uppercase">HIDDEN</span>
                  </div>
                </div>
              </div>

              <p className="text-white/60 text-xs text-center italic px-4">
                "You have surpassed the limits of your current form. The System offers you a path to transcendence. Do you accept the evolution?"
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  onClick={onDecline}
                  className="bg-transparent border-white/20 text-white/50 hover:text-white hover:border-white h-12 uppercase tracking-widest text-[10px]"
                >
                  Maintain Path
                </Button>
                <Button
                  onClick={() => onAccept(offer.id)}
                  className="bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black h-12 uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                >
                  Accept Job Change
                </Button>
              </div>
            </div>
          </SystemFrame>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
