import { PromptTemplate } from 'langchain/prompts';

import { createPrompt } from './languages';
import type { Conversation, Message } from '@prisma/client';

const taskPrompt = new PromptTemplate({
  template: `
  Analyze the message from a user below, correct their language mistakes 
  Make sure you're giving a short explanation for each correction. 
  Make your feedback as concise as possible for a quick response, but avoid rectifying errors stemming from speech recognition. 
  If no errors are found, affirm the message in the user's target or native language.
  Keep it all casual

  User's Message: {message_text}
  `,
  inputVariables: ['message_text'],
});

export const feedbackPrompt = async (
  conversation: Conversation,
  message: Message
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  return await prompt.format({
    format_instructions: '',
    context: '',
    task: await taskPrompt.format({
      message_text: message.text,
    }),
  });
};
