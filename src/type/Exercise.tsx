export type Exercise = {
  id: string;
  '@id'?: string;
  name: string;
  category?: string;
  description?: string;
  targetStat?: string;
  durationMinutes?: number | null;
  distanceMeters?: number | null;
  setCount?: number | null;
  repCount?: number | null;
  weightKg?: number | null;
};