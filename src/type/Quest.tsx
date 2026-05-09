import { Workout } from "./Workout";

export type Quest = {
  id?: string;
  name: string;
  description?: string;
  scheduledFor?: string;
  status?: string;
  progress?: number;
  completedAt?: string;
  calculatedCalories?: number;
  calculatedXp?: number;
  isHidden?: boolean;
  isPreset?: boolean;
  rewardGold?: number;
  rewardXp?: number;
  baseXp?: number;
  calculatedGold?: number;
  workout?: Workout | null;
};