'use client';

import { ReactNode, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  formatWorkoutExercise,
  getResourceId,
} from '@/lib/resourceUtils';
import { Quest } from '@/type/Quest';
import { Workout } from '@/type/Workout';
import { Exercise } from '@/type/Exercise';
import { ExerciseStat } from '../exercise/ExerciseStat';

export function QuestCard({
  quest,
  className = '',
  onEdit,
  onDelete,
}: {
  quest: Quest;
  className?: string;
  onEdit?: (quest: Quest) => void;
  onDelete?: (questId: string) => void;
}) {
  const workout = quest.workout as Workout | null | undefined;

  const title = quest?.name || 'Quest';
  const description = quest?.description || workout?.description || 'No description provided.';

  const rewardsText = useMemo(() => {
    return `+${quest.gold} Gold / +${quest.xp} XP`;
  }, [quest, quest.xp, workout]);

  return (
    <Card key={getResourceId(quest)} className={`border-primary/30 group ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-primary tracking-[0.3em] font-black uppercase text-sm">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onEdit && onDelete && (
              <>
                <button
                  onClick={() => onEdit?.(quest)}
                  className="text-[10px] bg-[#38bdf8]/20 text-[#38bdf8] px-2 py-1 rounded-sm font-black border border-[#38bdf8]/20 hover:bg-[#38bdf8]/30 transition-colors"
                >
                  EDIT
                </button>
                <button
                  onClick={() => onDelete?.(getResourceId(quest))}
                  className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded-sm font-black border border-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  DELETE
                </button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-md text-white/80 font-medium">{description}</p>

        {workout ? (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-3 border border-white/5">
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest mb-1">
                  Workout Duration
                </p>
                <p className="text-white font-black text-sm uppercase">
                  {workout.duration ?? 0} MINS
                </p>
              </div>
              <div className="bg-black/40 p-3 border border-white/5">
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest mb-1">
                  Calories
                </p>
                <p className="text-orange-300 font-black text-sm uppercase">
                  {quest.calories} KCAL
                </p>
              </div>
            </div>

            {(workout.exercises || []).length > 0 ? (
              <div className="pt-2 space-y-2 border-t border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Exercises
                </p>
                <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {(workout.exercises as Exercise[]).map((item, index) => {
                    return (
                      <li key={`workout-${workout.id}-exercise-${item.id}`} className="text-[10px] grid gap-2 text-white/70">
                        <span className="font-bold text-[14px] text-white/80">{item.name}</span>
                        <ExerciseStat exercise={item} category={item.category} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="bg-black/40 p-3 border border-white/5 mt-6">
          <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest mb-1">Rewards</p>
          <p className="text-[#38bdf8] font-black text-sm">{rewardsText}</p>
        </div>
      </CardContent>
    </Card>
  );
}

