"use client";

import { Exercise } from '@/type/Exercise';
import { Card, CardContent } from '@/components/ui/Card';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { getResourceId } from '@/lib/resourceUtils';

interface ExerciseGridProps {
  exercises: Exercise[];
  isLoading: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}

export const ExerciseGrid = ({
  exercises,
  isLoading,
  sentinelRef,
  onEdit,
  onDelete,
}: ExerciseGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="aspect-square bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="py-16 text-center grayscale border-white/20">
        <CardContent>
          <p className="font-black uppercase tracking-[0.4em] text-white/20">No exercises match your search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={getResourceId(exercise) ?? exercise.id ?? String(exercise['@id'] ?? '')}
            exercise={exercise}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-1" />
    </>
  );
};
