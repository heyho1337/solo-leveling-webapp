import { Exercise } from '@/type/Exercise';
import { Workout } from '@/type/Workout';

export interface WorkoutCardProps {
  workout: Workout;
  index: number;
  exercises: Exercise[];
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}