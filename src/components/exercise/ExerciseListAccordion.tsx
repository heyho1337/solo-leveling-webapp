'use client';

import { Exercise } from '@/Interface/exercise/ExerciseInterface';
import { ExerciseStat } from './ExerciseStat';
import { Workout } from '@/Interface/workout/WorkoutInterface';
import { ChevronDown } from 'lucide-react';

export function ExerciseListAccordion({
  exercises,
  workout,
}: {
  exercises: Exercise[];
  workout: Workout;
}) {
    const checkboxId = `exercises-accordion-${workout.id}`;

    return (
        <div className="pt-2 space-y-2 border-t border-white/5 [&:has(input:checked)_ul]:max-h-[600px] [&:has(input:checked)_svg]:rotate-180">
            <input
                type="checkbox"
                id={checkboxId}
                className="hidden"
            />
            <label
                htmlFor={checkboxId}
                className="flex justify-between items-center gap-2 cursor-pointer text-[10px] text-white/80 uppercase font-bold tracking-widest hover:text-white/60 transition-colors"
            >
                Exercises
                <ChevronDown className="w-4 h-4 transition-transform duration-300" />
            </label>
            <ul className="space-y-3 max-h-0 overflow-hidden transition-all duration-300 pr-1">
                {(exercises).map((item, index) => {
                    return (
                        <li key={`workout-${workout.id}-exercise-${item.id}`} className="text-[10px] grid gap-2 text-white/70">
                            <span className="font-bold text-[14px] text-white/80">{item.name}</span>
                            <ExerciseStat exercise={item} category={item.category || 'General'} />
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}