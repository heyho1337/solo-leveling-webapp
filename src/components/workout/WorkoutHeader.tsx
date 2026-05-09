'use client';

import { Button } from '@/components/ui/Button';
import { WorkoutHeaderProps } from '@/Interface/workout/WorkoutHeaderPropsInterface';
import { Plus } from 'lucide-react';
    

export function WorkoutHeader({ onAddClick }: WorkoutHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Workout Catalog
        </h2>
        <p className="text-white/40 uppercase tracking-widest text-[10px] mt-1 font-bold">
          Select your training protocol
        </p>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onAddClick}
        className="flex items-center gap-2 group"
      >
        <Plus className="h-4 w-4" />
        <span>Add New Workout</span>
      </Button>
    </div>
  );
}
