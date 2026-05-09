import { WorkoutContent } from '@/components/workout/WorkoutContent';
import api from '@/services/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/Interface/dashboard/UserInterface';

export default async function WorkoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const userData = response.data as User;
    
    if (!userData.hasCompletedQuestionnaire) {
      redirect('/onboarding');
    }

    const workoutResponse = await api.get('/users/me/workout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const workoutData = workoutResponse.data;

    const exerciseResponse = await api.get('/users/me/exercises', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const exerciseData = exerciseResponse.data;

    return <WorkoutContent workouts={workoutData} exercises={exerciseData}/>;
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 401) {
      //redirect('/login');
    }
    // Handle other errors or throw
    //redirect('/login');
  }
}
