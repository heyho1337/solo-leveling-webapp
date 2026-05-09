export interface HeaderPropsInterface {
  user: {
    username: string;
    level?: {
      currentLevel: number;
      rank?: string;
    };
    assignedClassName?: string;
  } | null;
}