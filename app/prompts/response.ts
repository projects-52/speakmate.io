import type { Conversation } from '@prisma/client';
import { createPrompt } from './languages';

export const responsePrompt = async (
  conversation: Conversation
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  return await prompt.format({
    format_instructions: '',
    context: `
      ${
        conversation.summary !== ''
          ? `Summary of the previous convesration: ${conversation.summary}`
          : ''
      }
    `,
    task: '',
  });
};
