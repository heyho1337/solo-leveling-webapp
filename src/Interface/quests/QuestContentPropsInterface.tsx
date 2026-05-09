import { Quest } from "./QuestInterface";
import { Workout } from "./WorkoutInterface";

export interface QuestContentProps {
  quests: Quest[];
  workouts: Workout[];
}