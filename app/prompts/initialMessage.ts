import { StructuredOutputParser } from 'langchain/output_parsers';
import { createPrompt } from './languages';
import type { Conversation } from '@prisma/client';

export const initialMessageParser =
  StructuredOutputParser.fromNamesAndDescriptions({
    message: 'Initial message to kick off conversation',
    name: 'Funny and memorable name for conversation. Use language that student is learning or native language of student based on the language proficiency level of student',
  });

const formatInstructions = initialMessageParser.getFormatInstructions();

export const initialMessagePrompt = async (
  conversation: Conversation
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  return await prompt.format({
    format_instructions: formatInstructions,
    task: '',
    context: '',
  });
};
