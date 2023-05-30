import { PromptTemplate } from 'langchain/prompts';

import { StructuredOutputParser } from 'langchain/output_parsers';

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

export const cardExplanationPrompt = new PromptTemplate({
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


User wants to add a dictionary item for the following text: {text}

User wants to keep those cards to learcn language more efficiently.

This text is the part of the following message: {message_text}


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
    'text',
  ],
  partialVariables: { format_instructions: formatInstructions },
});
