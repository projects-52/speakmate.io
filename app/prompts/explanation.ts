import { PromptTemplate } from 'langchain/prompts';

import { StructuredOutputParser } from 'langchain/output_parsers';
import type { Conversation, Message } from '@prisma/client';
import { createPrompt } from './languages';

const TRANSCRIPTIONS: Record<string, string> = {
  'en-US': 'Please use IPA for the phonetic transcription.',
  'es-ES': 'Please use IPA for the phonetic transcription.',
  'fr-FR': 'Please use IPA for the phonetic transcription.',
  'de-DE': 'Please use IPA for the phonetic transcription.',
  'nl-NL': 'Please use IPA for the phonetic transcription.',
  'jp-UK': 'Please use Hepburn romanization for the phonetic transcription.',
};

export const explanationParser =
  StructuredOutputParser.fromNamesAndDescriptions({
    highlighted: 'Highlighted text that the student wants to understand',
    transcription:
      'Phonetic transcription of the highlighted text and the highlighted text only in the language the student is learning',
    translation:
      "Translation of the highlighted text to the student's native language",
    explanation: 'Explanation of the meaning of the highlighted text',
  });

const formatInstructions = explanationParser.getFormatInstructions();

const taskPrompt = new PromptTemplate({
  template: `
  The student asked for an explanation of the specific phrase "{highlight}" within the context of your full message: "{message_text}".
  Focusing strictly on the highlighted phrase, please:
  1. Repeat the highlighted text.
  2. {transcription}.
  3. Translate just the highlighted text to the student's native language.
  4. Provide an explanation of just the highlighted text, taking into account the context of the full message, in a language suitable for the student's proficiency level.
  5. Keep the explanation short and simple to improve response time
`,
  inputVariables: ['message_text', 'highlight', 'transcription'],
});

export const explanationPrompt = async (
  conversation: Conversation,
  message: Message,
  highlight: string
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  const transcription = TRANSCRIPTIONS[conversation.language as string] ?? '';

  return await prompt.format({
    format_instructions: formatInstructions,
    context: '',
    task: await taskPrompt.format({
      message_text: message.text,
      highlight,
      transcription,
    }),
  });
};
