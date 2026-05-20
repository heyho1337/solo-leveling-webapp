'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { Button } from '@/components/ui/Button';
import { SystemAlert } from '@/components/ui/SystemAlert';
import { QuestionnaireConfig, QuestionnaireAnswer } from '@/Interface/onboarding/OnboardingInterface';
import { TextFieldInput } from './fields/TextFieldInput';
import { SelectFieldInput } from './fields/SelectFieldInput';
import { MultiSelectFieldInput } from './fields/MultiSelectFieldInput';
import { FrequencyAllocationInput } from './fields/FrequencyAllocationInput';
import { submitQuestionnaire } from '@/app/actions/onboarding';

interface OnboardingFormProps {
  config: QuestionnaireConfig;
}

export function OnboardingForm({ config }: OnboardingFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, QuestionnaireAnswer>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '' });

  const handleInputChange = (name: string, value: QuestionnaireAnswer) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const isCurrentSectionComplete = () => {
    const currentSection = config.sections[currentSectionIndex];
    return currentSection.fields.every(field => {
      const answer = answers[field.name];
      if (field.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      if (field.type === 'frequency-allocation') {
        const frequencies = answers['workoutFrequencies'] as Record<string, number>;
        const preferred = answers['preferredTraining'] as string[];
        return preferred?.every(p => frequencies?.[p] !== undefined);
      }
      return answer !== undefined && answer !== '';
    });
  };

  const handleNext = () => {
    if (isCurrentSectionComplete()) {
      if (currentSectionIndex < config.sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    } else {
      setAlert({ isVisible: true, message: 'ALL PARAMETERS MUST BE INITIALIZED.' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitQuestionnaire(answers);
      if (!result.success) throw new Error(result.error);

      setAlert({ isVisible: true, message: `AWAKENING COMPLETE! CLASS ASSIGNED: ${result.data?.class || 'UNKNOWN'}` });
      
      router.refresh();

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      setAlert({ isVisible: true, message: (error.message || 'SUBMISSION FAILED').toUpperCase() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSection = config.sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / config.sections.length) * 100;

  return (
    <>
      <SystemAlert
        isVisible={alert.isVisible}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />

      <div className="relative z-10 w-full max-w-3xl px-4">
        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-1 mb-8 overflow-hidden rounded-full border border-white/10">
          <div
            className="bg-[#38bdf8] h-full transition-all duration-500 shadow-[0_0_10px_#38bdf8]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <SystemFrame title={`Onboarding: Phase ${currentSectionIndex + 1}`} className="w-full">
          <div className="space-y-8 py-6">
            <div className="space-y-2 border-b border-white/5 pb-6">
              <h2 className="text-[#38bdf8] text-xl font-black uppercase tracking-widest">{currentSection.title}</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed">
                {currentSection.description}
              </p>
            </div>

            <div className="space-y-10 py-4">
              {currentSection.fields.map((field) => (
                <div key={field.name} className="space-y-4">
                  <label className="text-white text-sm font-bold uppercase tracking-widest block">
                    {field.label}
                  </label>

                  {field.type === 'select' && (
                    <SelectFieldInput 
                      field={field} 
                      value={answers[field.name]} 
                      onChange={(val) => handleInputChange(field.name, val)} 
                    />
                  )}

                  {field.type === 'multi-select' && (
                    <MultiSelectFieldInput 
                      field={field} 
                      value={answers[field.name]} 
                      onChange={(val) => handleInputChange(field.name, val)} 
                    />
                  )}

                  {field.type === 'text' && (
                    <TextFieldInput 
                      field={field} 
                      value={answers[field.name]} 
                      onChange={(val) => handleInputChange(field.name, val)} 
                    />
                  )}

                  {field.type === 'frequency-allocation' && (
                    <FrequencyAllocationInput 
                      answers={answers} 
                      onChange={handleInputChange} 
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/5">
              <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                Step {currentSectionIndex + 1} of {config.sections.length}
              </span>

              <Button
                onClick={handleNext}
                isLoading={isSubmitting}
                className="border-white text-white border-[1px] bg-transparent hover:bg-[#38bdf8] hover:text-black tracking-widest text-xs h-12 px-10"
              >
                {currentSectionIndex < config.sections.length - 1 ? 'CONTINUE PROTOCOL' : 'INITIALIZE AWAKENING'}
              </Button>
            </div>
          </div>
        </SystemFrame>
      </div>
    </>
  );
}
