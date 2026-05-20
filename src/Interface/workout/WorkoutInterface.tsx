import { Exercise } from '../exercise/ExerciseInterface';

export interface Workout {
  id: string;
  '@id'?: string;
  name: string;
  category: string;
  description?: string;
  duration: number;
  difficultyLevel: number;
  baseXp: number;
  calories?: number;
  isPreset?: boolean;
  exercises?: Array<Exercise | string>;
}
