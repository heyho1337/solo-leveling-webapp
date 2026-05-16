import { Workout } from "./Workout";

export type Quest = {
  id?: string;
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
};