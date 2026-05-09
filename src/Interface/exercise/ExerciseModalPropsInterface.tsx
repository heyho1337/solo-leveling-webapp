import { ReactNode } from 'react';

export interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}