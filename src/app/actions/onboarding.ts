'use server';

import { serverFetch, handleResponse } from './utils';
import { QuestionnaireAnswer } from '@/Interface/onboarding/OnboardingInterface';

export async function getQuestionnaireConfig() {
  const response = await serverFetch('/questionnaire/config');
  return handleResponse(response);
}

export async function submitQuestionnaire(answers: Record<string, QuestionnaireAnswer>) {
  const response = await serverFetch('/questionnaire/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });

  return handleResponse(response);
}
