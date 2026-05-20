'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getResourceId } from '@/lib/resourceUtils';
import { Exercise } from '@/Interface/exercise/ExerciseInterface';
import { ExerciseHeader } from '@/components/exercise/ExerciseHeader';
import { ExerciseGrid } from '@/components/exercise/ExerciseGrid';
import { ExerciseModal } from '@/components/exercise/ExerciseModal';
import { ExerciseForm } from '@/components/exercise/ExerciseForm';
import { submitExerciseForm, deleteExercise } from '@/app/actions/exercises';

const getExerciseTypeFromCategory = (category: string) => {
  const map: Record<string, string> = {
    Strength: 'STRENGTH',
    Cardio: 'CARDIO',
    Combat: 'COMBAT',
    Flexibility: 'FLEXIBILITY',
    Calisthenics: 'STRENGTH',
    Crossfit: 'STRENGTH',
  };
  return map[category] ?? 'GENERAL';
};

const EXERCISE_CATEGORIES = [
  'Weightlifting',
  'Running',
  'MartialArts',
  'Calisthenics',
  'Yoga',
  'Swimming',
  'Crossfit',
  'Biking'
] as const;

const getTargetStatFromCategory = (category: string) => {
  const map: Record<string, string> = {
    Weightlifting: 'strength',
    Running: 'endurance',
    MartialArts: 'power',
    Yoga: 'flexibility',
    Calisthenics: 'strength',
    Crossfit: 'stamina',
    Swimming: 'stamina',
  };
  return map[category] ?? 'stamina';
};

interface ExerciseContentProps {
  exercises: Exercise[] | null;
}

type ExerciseFormData = {
  name: string;
  category: string;
  description: string;
  repCount: number;
  setCount: number;
  duration: number;
  distance: number;
  weightKg: number;
};

const defaultFormData: ExerciseFormData = {
  name: '',
  category: 'Strength',
  description: '',
  repCount: 10,
  setCount: 4,
  duration: 0,
  distance: 500,
  weightKg: 20,
};

export function ExerciseContent({ exercises }: ExerciseContentProps) {
  const [exercisesList, setExercisesList] = useState<Exercise[]>(exercises ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exercisePage, setExercisePage] = useState(1);
  const [formData, setFormData] = useState<ExerciseFormData>(defaultFormData);

  const categoryOptions = useMemo(() => {
    return EXERCISE_CATEGORIES.map((category) => ({ id: category, label: category }));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description.trim() || 'No description provided.',
      exerciseType: formData.category,
      targetStat: getTargetStatFromCategory(formData.category),
      repCount: formData.repCount,
      setCount: formData.setCount,
      duration: formData.duration,
      distance: formData.distance,
      weightKg: String(formData.weightKg),
      isPreset: false,
    };

    try {
      if (editingExercise) {
        const exerciseId = getResourceId(editingExercise);
        if (!exerciseId) throw new Error('Missing exercise id');
        
        const result = await submitExerciseForm(payload, exerciseId);
        if (!result.success) throw new Error(result.error);

        setExercisesList((prev) =>
          prev.map((ex) =>
            getResourceId(ex) === exerciseId
              ? { ...ex, ...payload, repCount: payload.repCount, setCount: payload.setCount, duration: payload.duration, distance: payload.distance, weightKg: Number(payload.weightKg) }
              : ex
          )
        );
      } else {
        const result = await submitExerciseForm(payload);
        if (!result.success) throw new Error(result.error);
        setExercisesList((prev) => [...prev, result.data]);
      }

      setIsModalOpen(false);
      setEditingExercise(null);
      setExercisePage(1);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      category: exercise.category || 'Strength',
      description: exercise.description || '',
      repCount: exercise.repCount || 10,
      setCount: exercise.setCount || 4,
      duration: exercise.duration || 0,
      distance: exercise.distance || 1,
      weightKg: exercise.weightKg || 20,
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingExercise(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return exercisesList;

    return exercisesList.filter((exercise) => {
      return (
        exercise.name.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query) ||
        exercise.category?.toLowerCase().includes(query)
      );
    });
  }, [exercisesList, searchQuery]);

  const visibleExercises = useMemo(
    () => filteredExercises.slice(0, exercisePage * 12),
    [filteredExercises, exercisePage],
  );

  const exerciseSentinelRef = useInfiniteScroll({
    loading: false,
    hasMore: filteredExercises.length > visibleExercises.length,
    onLoadMore: () => setExercisePage((prev) => prev + 1),
  });

  const handleDelete = async (exercise: Exercise | string) => {
    try {
      const exerciseId = typeof exercise === 'string' ? exercise : getResourceId(exercise);
      if (!exerciseId) throw new Error('Missing exercise id');
      
      const result = await deleteExercise(exerciseId);
      if (!result.success) throw new Error(result.error);

      // refresh exercises after deletion through parent data update
      setExercisesList((prev) => prev.filter((ex) => getResourceId(ex) !== exerciseId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Reset pagination when search query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExercisePage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <ExerciseHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleAddClick}
      />

      <ExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExercise ? 'Edit exercise' : 'Create exercise'}
      >
        <ExerciseForm
          formData={formData}
          setFormData={setFormData}
          editingExercise={editingExercise}
          isSubmitting={isSubmitting}
          categoryOptions={categoryOptions}
          handleSubmit={handleSubmit}
        />
      </ExerciseModal>

      <ExerciseGrid
        exercises={visibleExercises}
        isLoading={false}
        sentinelRef={exerciseSentinelRef as any}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
