import { Workout } from '@/type/Workout';
import { Exercise } from '@/type/Exercise';

export interface WorkoutGridProps {
  workouts: Workout[];
  exercises: Exercise[];
  isLoading: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}
