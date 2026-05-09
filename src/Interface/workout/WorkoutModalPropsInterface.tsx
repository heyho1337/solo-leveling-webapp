import { ReactNode } from 'react';

export interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}