import { Workout } from "../workout/WorkoutInterface";

export interface Quest {
  id: string;
  name: string;
  description?: string;
  scheduledFor?: string;
  status?: string;
  progress?: number;
  completedAt?: string;
  calories?: number;
  xp?: number;
  isHidden?: boolean;
  isPreset?: boolean;
  gold?: number;
  workout?: Workout | null;
}
