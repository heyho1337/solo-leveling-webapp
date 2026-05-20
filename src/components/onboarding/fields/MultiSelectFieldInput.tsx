import { QuestionnaireField, QuestionnaireAnswer } from '@/Interface/onboarding/OnboardingInterface';

interface MultiSelectFieldInputProps {
  field: QuestionnaireField;
  value: QuestionnaireAnswer;
  onChange: (value: QuestionnaireAnswer) => void;
}

export function MultiSelectFieldInput({ field, value, onChange }: MultiSelectFieldInputProps) {
  const currentValues = (value as string[]) || [];

  const handleToggle = (optionValue: string) => {
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {field.options?.map((option, idx) => {
        const isSelected = currentValues.includes(String(option.value));
        return (
          <button
            key={`${field.name}-${idx}`}
            type="button"
            onClick={() => handleToggle(String(option.value))}
            className={`p-4 text-left border transition-all duration-300 uppercase text-[10px] tracking-widest font-bold
              ${isSelected
                ? 'bg-[#38bdf8]/10 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'bg-black/40 border-white/10 text-white/50 hover:border-white/30 hover:text-white'
              }`}
          >
            <div className="flex justify-between items-center w-full">
               <span>{option.label}</span>
               {isSelected && <span className="text-[8px] border border-[#38bdf8] px-2 py-0.5 rounded-sm bg-[#38bdf8]/20">SELECTED</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
