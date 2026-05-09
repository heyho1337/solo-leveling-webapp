export interface Quest {
  id: string;
  name: string;
  description?: string;
  status?: "active" | "completed";
  scheduledFor?: string;
  workout?: {
    id: string;
    name: string;
    description?: string;
};
  isHidden?: boolean;
}