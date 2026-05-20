import { Workout } from '@/Interface/workout/WorkoutInterface';
import { Exercise } from '@/Interface/exercise/ExerciseInterface';

export interface WorkoutGridProps {
  workouts: Workout[];
  exercises: Exercise[];
  isLoading: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}
