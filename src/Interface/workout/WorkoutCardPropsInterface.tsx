import { Exercise } from '@/Interface/exercise/ExerciseInterface';
import { Workout } from '@/Interface/workout/WorkoutInterface';

export interface WorkoutCardProps {
  workout: Workout;
  index: number;
  exercises: Exercise[];
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}