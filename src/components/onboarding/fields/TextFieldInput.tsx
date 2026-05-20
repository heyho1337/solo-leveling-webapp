import { QuestionnaireField, QuestionnaireAnswer } from '@/Interface/onboarding/OnboardingInterface';

interface TextFieldInputProps {
  field: QuestionnaireField;
  value: QuestionnaireAnswer;
  onChange: (value: QuestionnaireAnswer) => void;
}

export function TextFieldInput({ field, value, onChange }: TextFieldInputProps) {
  return (
    <input
      type="text"
      value={(value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] p-4 text-sm font-mono transition-all"
      placeholder={field.label}
    />
  );
}
