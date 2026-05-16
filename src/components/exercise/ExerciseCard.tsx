"use client";

import { Activity, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Exercise } from '@/type/Exercise';
import { getResourceId } from '@/lib/resourceUtils';
import { ExerciseCardProps } from '@/Interface/exercise/ExerciseCardPropsInterface';
import { ExerciseStat } from '@/components/exercise/ExerciseStat';
import { Button } from '@/components/ui/Button';

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
    >
      <CardContent className="p-4 flex flex-col h-full text-center">
        <div className="grid bg-white/5 p-3 grid-cols-[1fr_min-content_min-content] justify-end gap-2 rounded-sm mb-4 group-hover:bg-[#38bdf8]/10 transition-colors">
          <Activity className="h-6 w-6 text-white/40 mx-auto row-start-1 col-span-full transition-colors group-hover:text-[#38bdf8]" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(exercise)}
            className="h-6 px-2 text-[10px] text-white/60 normal-case border border-white/20 hover:text-[#38bdf8] col-start-2 row-start-1 hover:bg-[#38bdf8]/10"
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-6 px-2 text-[10px] text-white/60 normal-case border border-white/20 hover:text-red-400 col-start-3 row-start-1 hover:bg-red-400/10"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>

        <h4 className="text-[14px] font-black system-text-glow-strong uppercase tracking-widest text-white/80 group-hover:text-white mb-2">
          {exercise.name}
        </h4>
        <p className="text-[12px] text-white/60 font-[500] line-clamp-2 mb-3">{exercise.description || ''}</p>

        <ExerciseStat exercise={exercise} category={category} />

        <div className="grid items-center justify-between gap-2 mt-auto pt-3 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-white/80 text-left">{category}</span>
        </div>
      </CardContent>
    </Card>
  );
};
