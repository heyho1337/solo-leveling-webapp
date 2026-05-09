"use client";

import { ExerciseModalProps } from '@/Interface/exercise/ExerciseModalPropsInterface';
import { ManagementModal } from '@/components/ui/ManagementModal';

export const ExerciseModal = ({
  isOpen,
  onClose,
  title,
  children,
}: ExerciseModalProps) => {
  return (
    <ManagementModal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </ManagementModal>
  );
};
