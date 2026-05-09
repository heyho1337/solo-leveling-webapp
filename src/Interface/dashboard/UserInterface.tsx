import { UserStats } from './UserStatsInterface';

export interface User {
  id: string;
  username: string;
  email: string;
  hasCompletedQuestionnaire: boolean;
  level?: {
    currentLevel: number;
    rank?: string;
  };
  assignedClassName?: string;
  stats?: UserStats;
  [key: string]: unknown;
}