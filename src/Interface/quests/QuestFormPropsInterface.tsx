import { Quest } from "@/Interface/quests/QuestInterface";

export interface QuestFormProps {
  formData: {
    questName: string;
    description: string;
    scheduledFor: string;
    selectedWorkoutId: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      questName: string;
      description: string;
      scheduledFor: string;
      selectedWorkoutId: string;
    }>
  >;
  workoutOptions: { id: string; label: string; description: string }[];
  editingQuest: Quest | null;
  isSubmitting: boolean;
  handleWorkoutSelection: (workoutId: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}