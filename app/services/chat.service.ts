import type { Conversation, Message } from '@prisma/client';
import { LLMChain, PromptTemplate } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationSummaryMemory } from 'langchain/memory';
import { responsePrompt } from '~/prompts';
import { getLearningStyle } from '~/prompts/learningStyles';

export async function getCharResponse(
  conversation: Conversation,
  messages: Message[]
): Promise<string> {
  const memory = new ConversationSummaryMemory({
    memoryKey: 'chat_history',
    llm: new ChatOpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 }),
  });

  const model = new ChatOpenAI();

  const basePrompt = await responsePrompt.format({
    languageToLearn: conversation.language,
    languageLevel: conversation.level,
    nativeLanguage: conversation.native,
    topic: conversation.topic,
    characterName: conversation.character?.name,
    charcaterPersonality: conversation.character?.personality,
    learning_style: getLearningStyle(conversation.style as string),
  });

  const lastMessage = messages[messages.length - 1];

  const prompt = PromptTemplate.fromTemplate(`
    ${basePrompt}

    Current conversation:
    {chat_history}
    Human: {input}
  `);

  const chain = new LLMChain({ llm: model, prompt, memory });

  const response = await chain.call({ input: lastMessage.text });
  const memoryData = await memory.loadMemoryVariables({});


  return response.text;
}
