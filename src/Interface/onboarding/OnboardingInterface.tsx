export type QuestionnaireAnswer = string | number | boolean | null | string[] | Record<string, number>;

export interface QuestionnaireField {
  name: string;
  label: string;
  type: string;
  options?: { value: QuestionnaireAnswer; label: string }[];
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  fields: QuestionnaireField[];
}

export interface QuestionnaireConfig {
  sections: QuestionnaireSection[];
}
