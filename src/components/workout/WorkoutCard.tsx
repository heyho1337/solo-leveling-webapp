'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getResourceId } from '@/lib/resourceUtils';
import { Exercise } from '@/Interface/exercise/ExerciseInterface';
import { WorkoutCardProps } from '@/Interface/workout/WorkoutCardPropsInterface';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { ExerciseStat } from '../exercise/ExerciseStat';
import { ExerciseListAccordion } from '../exercise/ExerciseListAccordion';

export function WorkoutCard({ workout, index, exercises, onEdit, onDelete }: WorkoutCardProps) {
  const workoutId = getResourceId(workout) || workout.id || String(workout['@id'] ?? '');
  const workoutKey = workoutId || `fallback-workout-${index}`;

  const linkedExercises = (workout.exercises || [])
    .map((item) => {
      if (typeof item === 'string') {
        const id = getResourceId(item);
        return exercises.find((ex) => getResourceId(ex) === id) || null;
      }
      return item;
    })
    .filter(Boolean) as Exercise[];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full flex flex-col group overflow-hidden border-white/10 hover:border-[#38bdf8]/30 transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black tracking-widest text-[#38bdf8] uppercase">
              {workout.category}
            </span>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(workout)}
                className="h-6 px-2 text-[12px] text-white/80 font-black border border-white/40 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                EDIT
              </Button>

              {!workout.isPreset && workoutId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(workoutId)}
                  className="h-6 px-2 text-[12px] text-white/80 font-black border border-white/40 hover:text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  DELETE
                </Button>
              )}
            </div>
          </div>

          <CardTitle className="text-[14px] text-white/80 uppercase font-black system-text-glow-strong tracking-widest mt-2">
            {workout.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p className="text-[12px] text-white/60 mb-6 line-clamp-2">
            {workout.description || 'Quest assigned by The System.'}
          </p>

          <div className="mt-auto space-y-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/80">
              <span>Calories</span>
              <span className="text-[#38bdf8] system-text-glow-strong">{workout.calories} KCAL</span>
            </div>

            {linkedExercises.length === 0 ? (
                <p className="text-[10px] text-white/25">No exercises linked yet.</p>
              ) : (
                <ExerciseListAccordion exercises={linkedExercises} workout={workout} />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
