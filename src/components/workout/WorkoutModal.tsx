'use client';

import { ManagementModal } from '@/components/ui/ManagementModal';
import { WorkoutModalProps } from '@/Interface/workout/WorkoutModalPropsInterface';

export function WorkoutModal({ isOpen, onClose, title, children }: WorkoutModalProps) {
  return (
    <ManagementModal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </ManagementModal>
  );
}
