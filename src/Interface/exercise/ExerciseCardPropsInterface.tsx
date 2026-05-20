import { Exercise } from '@/Interface/exercise/ExerciseInterface';

export interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}