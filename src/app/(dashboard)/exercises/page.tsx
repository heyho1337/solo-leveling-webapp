import { ExerciseContent } from '@/components/exercise/ExerciseContent';
import { getExercises } from '@/app/actions/exercises';
import { getCurrentUser } from '@/app/actions/utils';
import { redirect } from 'next/navigation';

export default async function ExercisePage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success) {
    redirect('/login');
  }

  if (!userResult.data.hasCompletedQuestionnaire) {
    redirect('/onboarding');
  }

  const exerciseResult = await getExercises();

  if (!exerciseResult.success) {
    // Handle error, maybe show a message or redirect
    console.error('Failed to fetch exercises:', exerciseResult.error);
    return <div>Failed to load exercises.</div>;
  }

  return <ExerciseContent exercises={exerciseResult.data}/>;
}
