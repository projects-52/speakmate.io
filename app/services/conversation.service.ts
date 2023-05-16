import type { Character } from '~/types/character.type';
import { createMessage } from './message.service';
import { getInitialMesage } from './openai.service';
import { prisma } from './prisma.service';

export async function getAllConversationsForUser(userId: string) {
  try {
    return await prisma.conversation.findMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getConversationById(id: string) {
  try {
    return await prisma.conversation.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createConversation(
  userId: string,
  name: string,
  language: string,
  native: string,
  level: string,
  topic: string,
  characterData: Character
) {
  try {
    const conversationData = {
      userId,
      name,
      language,
      native,
      level,
      topic,
      character: {
        slug: characterData.slug,
        name: characterData.name,
        personality: characterData.personality,
      },
    };
    const data = await getInitialMesage(conversationData);

    console.log(data);

    const parsedData = JSON.parse(data as string);

    const conversation = await prisma.conversation.create({
      data: { ...conversationData, name: parsedData.name },
    });

    await createMessage(
      conversation.id,
      parsedData.message as string,
      'assistant'
    );

    return conversation;
  } catch (error) {
    console.error('ERROR CREATING CONVERSATION', error);
    return null;
  }
}
