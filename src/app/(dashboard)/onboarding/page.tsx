import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { StarBackground } from '@/components/ui/StarBackground';

export default function OnboardingPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden pb-20 pt-10">
      <StarBackground />

      <main className="relative z-10 w-full max-w-3xl px-4">
        <OnboardingForm />
      </main>
    </div>
  );
}
