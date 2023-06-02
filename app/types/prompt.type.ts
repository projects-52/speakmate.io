export type PromptParams = {
  personality: string;
  level: string;
  language: 'english' | 'spanish' | 'french' | 'german' | 'dutch' | 'japanese';
  native_language: string;
  topic: string;
  teaching_style: string;
  task: string;
  format_instructions: string;
};
