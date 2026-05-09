'use client';

import { useMemo, useState } from 'react';
import api from '@/services/api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getResourceId, resourceIri } from '@/lib/resourceUtils';
import { Exercise } from '@/type/Exercise';
import { Workout } from '@/type/Workout';
import { WorkoutHeader } from './WorkoutHeader';
import { WorkoutModal } from './WorkoutModal';
import { WorkoutForm } from './WorkoutForm';
import { WorkoutGrid } from './WorkoutGrid';

const WORKOUT_CATEGORIES = [
  'Weightlifting',
  'Running',
  'MartialArts',
  'Calisthenics',
  'Cardio',
  'Yoga',
  'Swimming',
] as const;

const getWorkoutTypeFromCategory = (category: string) => {
  const map: Record<string, string> = {
    Weightlifting: 'STRENGTH',
    Running: 'CARDIO',
    MartialArts: 'COMBAT',
    Calisthenics: 'STRENGTH',
    Cardio: 'CARDIO',
    Yoga: 'FLEXIBILITY',
    Swimming: 'CARDIO',
  };

  return map[category] ?? 'GENERAL';
};

const defaultFormData = {
  name: '',
  category: 'Weightlifting',
  description: '',
  estimatedDurationMinutes: 30,
  difficultyLevel: 1,
  calories: 180,
  selectedExerciseIds: [] as string[],
};

export function WorkoutContent({
  exercises,
  workouts,
}: {
  exercises: Exercise[];
  workouts: Workout[];
}) {
  const [workoutsList, setWorkoutsList] = useState<Workout[]>(workouts || []);
  const [isLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [workoutPage, setWorkoutPage] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);

  const exerciseOptions = useMemo(
    () =>
      exercises
        .map((exercise) => ({
          id: String(getResourceId(exercise)),
          label: exercise.name,
          description: exercise.category || 'General',
        }))
        .filter((opt) => opt.id.length > 0),
    [exercises],
  );

  const workoutCategoryOptions = useMemo(
    () =>
      WORKOUT_CATEGORIES.map((category) => ({
        id: category,
        label: category.replace(/([A-Z])/g, ' $1').trim(),
      })),
    [],
  );

  const displayedWorkouts = useMemo(
    () => workoutsList.slice(0, workoutPage * 9),
    [workoutsList, workoutPage],
  );

  const workoutSentinelRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: displayedWorkouts.length < workoutsList.length,
    onLoadMore: () => setWorkoutPage((prev) => prev + 1),
  });

  const computedBaseXp = Math.max(
    100,
    formData.difficultyLevel * 100 + formData.estimatedDurationMinutes * 10,
  );

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        workoutType: getWorkoutTypeFromCategory(formData.category),
        description: formData.description.trim(),
        estimatedDurationMinutes: formData.estimatedDurationMinutes,
        difficultyLevel: formData.difficultyLevel,
        baseXp: computedBaseXp,
        calories: formData.calories,
        isPreset: false,
        exercises: formData.selectedExerciseIds.map((exerciseId) =>
          resourceIri('exercises', exerciseId),
        ),
      };

      if (editingWorkout) {
        const workoutId = getResourceId(editingWorkout) || editingWorkout.id || String(editingWorkout['@id'] ?? '');

        if (!workoutId) throw new Error('Missing workout id');

        await api.patch(`/users/me/workout/${workoutId}`, payload, {
          headers: { 'Content-Type': 'application/merge-patch+json' },
        });

        setWorkoutsList((prev) =>
          prev.map((w) =>
            (getResourceId(w) || w.id || String(w['@id'] ?? '')) === workoutId
              ? { ...w, ...payload, exercises: formData.selectedExerciseIds.map((id) => resourceIri('exercises', id)) }
              : w
          )
        );
      } else {
        const response = await api.post('/users/me/workout', payload);
        setWorkoutsList((prev) => [...prev, response.data]);
      }

      setIsModalOpen(false);
      setEditingWorkout(null);
      resetForm();
      setWorkoutPage(1);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    const newSelectedExerciseIds = (
      (workout.exercises || []).map((item) => getResourceId(item)).filter(Boolean) as string[]
    );
    console.log('Exercises from workout object:', workout.exercises);
    console.log('Calculated selectedExerciseIds (before setFormData):', newSelectedExerciseIds);
    setFormData({
      name: workout.name,
      category: workout.category,
      description: workout.description,
      estimatedDurationMinutes: workout.estimatedDurationMinutes,
      difficultyLevel: workout.difficultyLevel,
      calories: workout.calories || 0,
      selectedExerciseIds: newSelectedExerciseIds,
    });
    console.log('Exercise Options (after setFormData):', exerciseOptions);
    setIsModalOpen(true);
  };

  const handleDelete = async (workoutId: string) => {
    try {
      await api.delete(`/users/me/workout/${workoutId}`);
      setWorkoutsList((prev) =>
        prev.filter((w) => (getResourceId(w) || w.id || String(w['@id'] ?? '')) !== workoutId)
      );
      setWorkoutPage(1);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleAddClick = () => {
    setEditingWorkout(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <WorkoutHeader onAddClick={handleAddClick} />

      <WorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkout ? 'Edit Protocol' : 'New Training Protocol'}
      >
        <WorkoutForm
          formData={formData}
          setFormData={setFormData}
          exerciseOptions={exerciseOptions}
          workoutCategoryOptions={workoutCategoryOptions}
          exercises={exercises}
          computedBaseXp={computedBaseXp}
          isSubmitting={isSubmitting}
          editingWorkout={!!editingWorkout}
          handleSubmit={handleSubmit}
        />
      </WorkoutModal>

      <WorkoutGrid
        workouts={displayedWorkouts}
        exercises={exercises}
        isLoading={isLoading}
        sentinelRef={workoutSentinelRef as React.RefObject<HTMLDivElement>}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
