import { Exercise } from '@/type/Exercise';
import { ExerciseStatProps } from '@/Interface/exercise/ExerciseStatPropsInterface';

export const ExerciseStat = ({ exercise, category }: ExerciseStatProps) => {
    return (
        <div className="grid grid-cols-2 gap-2 text-[8px] uppercase tracking-[0.2em] text-white/40 mb-3">
          {(category === 'Strength' || category === 'Full Body') && (
            <>
              {exercise.setCount != null && <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Sets: {exercise.setCount}</span>}
              {exercise.repCount != null && <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Reps: {exercise.repCount}</span>}
              {exercise.weightKg != null && <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Weight: {exercise.weightKg} kg</span>}
            </>
          )}
          {category === 'Cardio' && (
            <>
              {exercise.durationMinutes != null && <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Duration: {exercise.durationMinutes} min</span>}
              {exercise.distanceMeters != null && <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Distance: {exercise.distanceMeters} m</span>}
            </>
          )}
          {(category === 'Combat' || category === 'Flexibility' || category === 'Bodyweight') && (
            <>
              {exercise.repCount != null && <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Reps: {exercise.repCount}</span>}
            </>
          )}
          <span className="border border-white/10 px-2 py-1 rounded-sm bg-white/5">Stat gain: {exercise.targetStat}</span>
        </div>
    );
}