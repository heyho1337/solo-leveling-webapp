"use client";

import { Activity, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Exercise } from '@/type/Exercise';
import { getResourceId } from '@/lib/resourceUtils';
import { ExerciseCardProps } from '@/components/Interface/ExerciseCardPropsInterface';
import { ExerciseStat } from '@/components/exercise/ExerciseStat';

export const ExerciseCard = ({ exercise, onEdit, onDelete }: ExerciseCardProps) => {
  const exerciseId = getResourceId(exercise) || exercise.id || String(exercise['@id'] ?? '');
  const category = exercise.category || 'General';

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (exerciseId) {
      onDelete(exerciseId);
    }
  };

  return (
    <Card
      className="p-0 border-white/10 hover:border-[#38bdf8]/40 transition-all cursor-pointer group relative"
      onClick={() => onEdit(exercise)}
    >
      <CardContent className="p-4 flex flex-col h-full text-center">
        <div className="bg-white/5 p-3 rounded-sm mb-4 group-hover:bg-[#38bdf8]/10 transition-colors">
          <Activity className="h-6 w-6 text-white/40 mx-auto group-hover:text-[#38bdf8] transition-colors" />
        </div>

        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white mb-2">
          {exercise.name}
        </h4>
        <p className="text-[9px] text-white/50 line-clamp-2 mb-3">{exercise.description || ''}</p>

        <ExerciseStat exercise={exercise} category={category} />

        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{category}</span>
          <button
            type="button"
            onClick={handleDelete}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Delete exercise"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
