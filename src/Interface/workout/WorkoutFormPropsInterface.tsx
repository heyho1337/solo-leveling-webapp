import { Exercise } from '@/type/Exercise';

export interface WorkoutFormProps {
  formData: {
    name: string;
    category: string;
    description: string;
    estimatedDurationMinutes: number;
    difficultyLevel: number;
    calories: number;
    selectedExerciseIds: string[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      category: string;
      description: string;
      estimatedDurationMinutes: number;
      difficultyLevel: number;
      calories: number;
      selectedExerciseIds: string[];
    }>
  >;
  exerciseOptions: { id: string; label: string; description: string }[];
  workoutCategoryOptions: { id: string; label: string }[];
  exercises: Exercise[];
  computedBaseXp: number;
  isSubmitting: boolean;
  editingWorkout: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}