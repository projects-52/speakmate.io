import { PromptTemplate } from 'langchain/prompts';

import { StructuredOutputParser } from 'langchain/output_parsers';
import type { Conversation, Message } from '@prisma/client';
import { createPrompt } from './languages';

export const cardExplanationParser =
  StructuredOutputParser.fromNamesAndDescriptions({
    text: 'original part of the message to explain',
    transcription:
      'original part of the message transcribed according to the rules of the phonetic transcription',
    translation:
      "original part of the message translated to the user's native language",
    explanation:
      'Explanation of the meaning, considering context of the message. Depends on the level, you should use either native language or the one user learns',
  });

const formatInstructions = cardExplanationParser.getFormatInstructions();

const taskPrompt = new PromptTemplate({
  template: `
  User wants to add a dictionary item for the following text: {text}

  User wants to keep those cards to learcn language more efficiently.

  This text is the part of the following message: {message_text}
  `,
  inputVariables: ['message_text', 'text'],
});

export const cardExplanationPrompt = async (
  conversation: Conversation,
  message: Message,
  text: string
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  return await prompt.format({
    format_instructions: formatInstructions,
    context: '',
    task: await taskPrompt.format({
      message_text: message.text,
      text,
    }),
  });
};
