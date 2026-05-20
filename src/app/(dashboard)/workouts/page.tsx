import { WorkoutContent } from '@/components/workout/WorkoutContent';
import { getWorkouts } from '@/app/actions/workouts';
import { getExercises } from '@/app/actions/exercises';
import { getCurrentUser } from '@/app/actions/utils';
import { redirect } from 'next/navigation';

export default async function WorkoutPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success) {
    redirect('/login');
  }

  if (!userResult.data.hasCompletedQuestionnaire) {
    redirect('/onboarding');
  }

  const [workoutResult, exerciseResult] = await Promise.all([
    getWorkouts(),
    getExercises()
  ]);

  if (!workoutResult.success || !exerciseResult.success) {
    console.error('Failed to fetch data:', workoutResult.error || exerciseResult.error);
    return <div>Failed to load workout data.</div>;
  }

  return <WorkoutContent workouts={workoutResult.data} exercises={exerciseResult.data}/>;
}
