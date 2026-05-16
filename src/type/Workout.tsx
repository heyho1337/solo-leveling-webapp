import { Exercise } from '@/type/Exercise';

export type Workout = {
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
};