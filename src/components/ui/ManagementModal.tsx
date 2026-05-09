'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SystemFrame } from './SystemFrame';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function ManagementModal({ isOpen, onClose, title, children }: ManagementModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-8 z-[110] text-white/40 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <SystemFrame title={title}>
              <div className="text-left py-4 px-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </SystemFrame>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
