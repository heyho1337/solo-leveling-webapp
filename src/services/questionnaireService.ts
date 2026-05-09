import api from './api';

type QuestionnaireAnswer = string | number | boolean | null | string[] | Record<string, number>;

export const questionnaireService = {
  async getConfig() {
    const response = await api.get('/questionnaire/config');
    return response.data;
  },

  async submitAnswers(answers: Record<string, QuestionnaireAnswer>) {
    const response = await api.post('/questionnaire/submit', { answers });
    return response.data;
  }
};
