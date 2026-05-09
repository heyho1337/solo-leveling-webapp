'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionnaireService } from '@/services/questionnaireService';
import api from '@/services/api';
import { SystemFrame } from '@/components/ui/SystemFrame';
import { Button } from '@/components/ui/Button';
import { SystemAlert } from '@/components/ui/SystemAlert';

type QuestionnaireAnswer = string | number | boolean | null | string[] | Record<string, number>;

type ApiResponseError = {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
};

interface ConfigField {
  name: string;
  label: string;
  type: string;
  options?: { value: QuestionnaireAnswer; label: string }[];
}

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  fields: ConfigField[];
}

export function OnboardingForm() {
  const router = useRouter();
  const [config, setConfig] = useState<{ sections: ConfigSection[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, QuestionnaireAnswer>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '' });

  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        const meResponse = await api.get('/users/me');
        const user = meResponse.data;

        if (user.hasCompletedQuestionnaire) {
          router.push('/dashboard');
          return;
        }

        const data = await questionnaireService.getConfig();
        setConfig(data);
      } catch (error: unknown) {
        const apiError = error as ApiResponseError;
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          router.push('/login');
          return;
        }

        setAlert({ isVisible: true, message: 'UNABLE TO LOAD ONBOARDING DATA. PLEASE SIGN IN AGAIN.' });
      } finally {
        setIsLoading(false);
      }
    };

    initializeOnboarding();
  }, [router]);

  const handleInputChange = (name: string, value: QuestionnaireAnswer) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, value: string) => {
    setAnswers(prev => {
      const currentValues = (prev[name] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const isCurrentSectionComplete = () => {
    if (!config) return false;
    const currentSection = config.sections[currentSectionIndex];
    return currentSection.fields.every(field => {
      const answer = answers[field.name];
      if (field.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined;
    });
  };

  const handleNext = () => {
    if (isCurrentSectionComplete()) {
      if (currentSectionIndex < (config?.sections.length || 0) - 1) {
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
      const result = await questionnaireService.submitAnswers(answers);
      setAlert({ isVisible: true, message: `AWAKENING COMPLETE! CLASS ASSIGNED: ${result.class}` });
      
      // Refresh to ensure server components see the updated questionnaire status
      router.refresh();

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as any;
      let errorMessage = 'SUBMISSION FAILED.';

      if (apiError.response?.data?.violations?.[0]?.message) {
        errorMessage = apiError.response.data.violations[0].message;
      } else if (apiError.response?.data?.detail) {
        errorMessage = apiError.response.data.detail;
      } else if (apiError.response?.data?.description) {
        errorMessage = apiError.response.data.description;
      } else if (apiError.response?.data?.['hydra:description']) {
        errorMessage = apiError.response.data['hydra:description'];
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      setAlert({ isVisible: true, message: errorMessage.toUpperCase() });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#38bdf8] uppercase tracking-[0.5em]">Syncing with System...</div>;
  if (!config) return null;

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {field.options?.map((option, idx) => (
                        <button
                          key={`${field.name}-${idx}`}
                          onClick={() => handleInputChange(field.name, option.value)}
                          className={`p-4 text-left border transition-all duration-300 uppercase text-[10px] tracking-widest font-bold
                            ${answers[field.name] === option.value
                              ? 'bg-[#38bdf8]/10 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                              : 'bg-black/40 border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === 'multi-select' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {field.options?.map((option, idx) => {
                        const isSelected = Array.isArray(answers[field.name]) && (answers[field.name] as string[]).includes(String(option.value));
                        return (
                          <button
                            key={`${field.name}-${idx}`}
                            onClick={() => handleMultiSelectChange(field.name, String(option.value))}
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
                  )}

                  {field.type === 'frequency-allocation' && (
                    <div className="space-y-6">
                      {((answers['preferredTraining'] as string[]) || []).map((type) => (
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
                              handleInputChange('workoutFrequencies', { ...currentFreqs, [type]: newFreq });
                            }}
                            className="w-full accent-[#38bdf8] bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] text-white/30 font-bold uppercase tracking-widest">
                            <span>RECOVERY ONLY</span>
                            <span>DAILY INTENSITY</span>
                          </div>
                        </div>
                      ))}
                      {((answers['preferredTraining'] as string[]) || []).length === 0 && (
                        <p className="text-secondary text-center py-10 uppercase text-xs tracking-widest font-bold">
                          Warning: No training methods selected in previous phase.
                        </p>
                      )}
                    </div>
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
