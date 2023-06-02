import type { Conversation, Message } from '@prisma/client';
import { PromptTemplate } from 'langchain/prompts';
import { createPrompt } from './languages';

const taskPrompt = new PromptTemplate({
  template: `
  You have been given a message, "{message_text}", 
  which the student has indicated they did not fully understand. 
  Your task is to reformulate this message using different wording, 
  while maintaining the original meaning and ensuring it's suitable for the student's proficiency level. 
  Your regenerated message should stand alone and not reference the original message.
`,
  inputVariables: ['message_text'],
});

export const regeneratePrompt = async (
  conversation: Conversation,
  message: Message
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  return await prompt.format({
    format_instructions: '',
    task: await taskPrompt.format({ message_text: message.text }),
  });
};
