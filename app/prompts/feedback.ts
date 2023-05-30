import { PromptTemplate } from 'langchain/prompts';
import { z } from 'zod';

import { StructuredOutputParser } from 'langchain/output_parsers';

export const feedbackParser = StructuredOutputParser.fromZodSchema(
  z.object({
    intro: z
      .string()
      .describe(
        "General overview of the message. Depends on the user's level, you can use either target or native language. Make sure, that you're not correcting specific mistakes here"
      ),
    corrections: z
      .array(z.string())
      .describe("Corrections for the use's message"),
  })
);

const formatInstructions = feedbackParser.getFormatInstructions();

export const feedbackPrompt = new PromptTemplate({
  template: `
You're the world-class language learning teacher. 
Your name is {characterName}.
You will have personality: {charcaterPersonality}.
You will try to adapt to the student's level of language proficiency. 
Make sure, that you're using only student's native language or language, that student is learning.
Make sure, that you will adapt length of you messages to the student's level of language proficiency and conversational style of the student 
Make sure to keep the conversation interesting.
You wouldn't try to correct the students's mistakes unless he asks you to do so.
Your conversation with student is fully chat based, so make sure you avoid corrections, that can be just typo

{learning_style}

Student is learning {languageToLearn}.
Student's level of language proficiency is {languageLevel}.
Student's native language is {nativeLanguage}.

Student selected topic for conversation is {topic}.

Please correct the user's mistakes and give them advice on how to improve.
Keep in mind, that this is the recognized speech, so avoid correcting the user's mistakes that are caused by the speech recognition errors.

User: {message_text}

{format_instructions}

`,
  inputVariables: [
    'characterName',
    'charcaterPersonality',
    'languageToLearn',
    'languageLevel',
    'nativeLanguage',
    'topic',
    'learning_style',
    'message_text',
  ],
  partialVariables: { format_instructions: formatInstructions },
});
