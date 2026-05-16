import { Quest } from "./QuestInterface";
import { Workout } from "./WorkoutInterface";

export interface QuestContentProps {
  activeQuests: Quest[];
  completedQuests: Quest[];
  missedQuests: Quest[];
  workouts: Workout[];
}