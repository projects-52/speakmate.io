// import { StructuredOutputParser } from 'langchain/output_parsers';
import type { Conversation } from '@prisma/client';
import { createPrompt } from './languages';

// export const responseParser = StructuredOutputParser.fromNamesAndDescriptions({
//   text: "Response to the student's message",
//   summary:
//     'Summary of the conversation with the student. Keep all the important information here. So you will be able to use it in the next messages.',
// });

// const formatInstructions = responseParser.getFormatInstructions();

export const responsePrompt = async (
  conversation: Conversation
): Promise<string> => {
  const prompt = await createPrompt(conversation);

  console.log('SUMMARY', conversation.summary);

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
