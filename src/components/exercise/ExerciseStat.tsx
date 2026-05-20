import { Exercise } from '@/Interface/exercise/ExerciseInterface';
import { ExerciseStatProps } from '@/Interface/exercise/ExerciseStatPropsInterface';

export const ExerciseStat = ({ exercise, category }: ExerciseStatProps) => {
    return (
        <div className="grid grid-cols-4 gap-2 text-[12px] text-white/80 mb-3">
          {(category === 'Weightlifting' || category === 'Crossfit' || category === 'Calisthenics') && (
            <>
              {exercise.setCount != null && <span className="px-2 py-1 rounded-sm bg-sky-400/10">Sets: {exercise.setCount}</span>}
              {exercise.repCount != null && <span className="px-2 py-1 rounded-sm bg-sky-400/10">Reps: {exercise.repCount}</span>}
              {exercise.weightKg != null && <span className="px-2 py-1 rounded-sm bg-sky-400/10">Weight: {exercise.weightKg} kg</span>}
            </>
          )}
          {(category === 'Running' || category === 'Swimming' || category === 'Riding') && (
            <>
              {exercise.duration != null && <span className="px-2 py-1 rounded-sm bg-sky-400/10">Duration: {exercise.duration} min</span>}
              {exercise.distance != null && <span className="px-2 py-1 rounded-sm bg-sky-400/10">Distance: {exercise.distance} km</span>}
            </>
          )}
          {category === 'MartialArts' && (
            <>
              {exercise.repCount != null && <span className="px-2 py-1 rounded-sm bg-sky-400/10">Reps: {exercise.repCount}</span>}
            </>
          )}
          <span className="px-2 py-1 rounded-sm bg-sky-400/10">Stat gain: {exercise.targetStat}</span>
        </div>
    );
}