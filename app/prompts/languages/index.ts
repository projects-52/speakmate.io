import type { Conversation } from '@prisma/client';
import type { PromptTemplate } from 'langchain';
import { getLearningStyle } from '../learningStyles';
import { baseDutchPrompt } from './dutch';
import { baseEnglishPrompt } from './english';
import { baseFrenchPrompt } from './french';
import { baseGermanPrompt } from './german';
import { baseJapanesePrompt } from './japanese';
import { baseSpanishPrompt } from './spanish';

const BASE_PROMPTS: Record<string, PromptTemplate> = {
  'jp-UK': baseJapanesePrompt,
  'en-US': baseEnglishPrompt,
  'es-ES': baseSpanishPrompt,
  'fr-FR': baseFrenchPrompt,
  'de-DE': baseGermanPrompt,
  'nl-NL': baseDutchPrompt,
};

export const getBasePrompt = (language: string): PromptTemplate => {
  const basePrompt = BASE_PROMPTS[language];
  if (!basePrompt) {
    throw new Error(`No base prompt found for language ${language}`);
  }
  return basePrompt;
};

export const createPrompt = async (
  conversation: Conversation
): Promise<PromptTemplate> => {
  const basePrompt = getBasePrompt(conversation.language as string);

  return await basePrompt.partial({
    native_language: conversation.native as string,
    level: conversation.level as string,
    topic: conversation.topic as string,
    personality: conversation.character?.personality as string,
    teaching_style: getLearningStyle(conversation.style as string),
  });
};
