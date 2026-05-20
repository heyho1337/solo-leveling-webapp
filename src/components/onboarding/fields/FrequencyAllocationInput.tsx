import { QuestionnaireAnswer } from '@/Interface/onboarding/OnboardingInterface';

interface FrequencyAllocationInputProps {
  answers: Record<string, QuestionnaireAnswer>;
  onChange: (name: string, value: QuestionnaireAnswer) => void;
}

export function FrequencyAllocationInput({ answers, onChange }: FrequencyAllocationInputProps) {
  const preferredTraining = (answers['preferredTraining'] as string[]) || [];

  if (preferredTraining.length === 0) {
    return (
      <p className="text-secondary text-center py-10 uppercase text-xs tracking-widest font-bold">
        Warning: No training methods selected in previous phase.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {preferredTraining.map((type) => (
        <div key={type} className="bg-black/40 border border-white/10 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#38bdf8] text-[10px] font-black uppercase tracking-widest">
              {type.replace(/([A-Z])/g, ' $1').trim()} SESSIONS
            </span>
            <span className="text-white text-lg font-black">
              {((answers['workoutFrequencies'] as Record<string, number>) || {})[type] || 0}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="7"
            value={((answers['workoutFrequencies'] as unknown as Record<string, number>) || {})[type] || 0}
            onChange={(e) => {
              const newFreq = parseInt(e.target.value);
              const currentFreqs = (answers['workoutFrequencies'] as unknown as Record<string, number>) || {};
              onChange('workoutFrequencies', { ...currentFreqs, [type]: newFreq });
            }}
            className="w-full accent-[#38bdf8] bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[8px] text-white/30 font-bold uppercase tracking-widest">
            <span>RECOVERY ONLY</span>
            <span>DAILY INTENSITY</span>
          </div>
        </div>
      ))}
    </div>
  );
}
