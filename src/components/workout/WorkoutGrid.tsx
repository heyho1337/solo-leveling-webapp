'use client';

import { Card } from '@/components/ui/Card';
import { WorkoutCard } from './WorkoutCard';
import { WorkoutGridProps } from '@/Interface/WorkoutGridPropsInterface';


export function WorkoutGrid({
  workouts,
  exercises,
  isLoading,
  sentinelRef,
  onEdit,
  onDelete,
}: WorkoutGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse grayscale brightness-50">
            <div className="h-48" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout, idx) => (
          <WorkoutCard
            key={idx}
            workout={workout}
            index={idx}
            exercises={exercises}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-1" />
    </>
  );
}
