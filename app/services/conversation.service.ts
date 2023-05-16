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
    const conversation = await prisma.conversation.create({
      data: {
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
      },
    });

    const initialMessage = await getInitialMesage(conversation);

    await createMessage(conversation.id, initialMessage as string, 'assistant');

    return conversation;
  } catch (error) {
    console.error('ERROR CREATING CONVERSATION', error);
    return null;
  }
}
