import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { StarBackground } from '@/components/ui/StarBackground';
import { getQuestionnaireConfig } from '@/app/actions/onboarding';
import { getCurrentUser } from '@/app/actions/utils';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const userResult = await getCurrentUser();
  
  if (!userResult.success) {
    redirect('/login');
  }

  if (userResult.data.hasCompletedQuestionnaire) {
    redirect('/dashboard');
  }

  const configResult = await getQuestionnaireConfig();
  
  if (!configResult.success) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500 uppercase tracking-widest">
        Error loading protocol: {configResult.error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden pb-20 pt-10">
      <StarBackground />

      <main className="relative z-10 w-full max-w-3xl px-4">
        <OnboardingForm config={configResult.data} />
      </main>
    </div>
  );
}
