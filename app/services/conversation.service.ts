import type { Character } from '~/types/character.type';
import { createMessage } from './message.service';
import { getInitialMesage } from './openai.service';
import { prisma } from './prisma.service';

export async function getAllConversationsForUser(userId: string) {
  try {
    return await prisma.conversation.findMany({
      where: {
        userId,
        deleted: false,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getConversationById(id: string) {
  try {
    return await prisma.conversation.findFirst({
      where: {
        id,
        deleted: false,
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
  let voiceGender = characterData.gender;

  if (voiceGender === 'non-binary') {
    voiceGender = Math.random() > 0.5 ? 'male' : 'female';
  }

  try {
    const conversationData = {
      userId,
      name,
      language,
      native,
      level,
      topic,
      deleted: false,
      character: {
        slug: characterData.slug,
        name: characterData.name,
        personality: characterData.personality,
        gender: characterData.gender,
      },
    };
    const data = await getInitialMesage(conversationData);

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

export async function deleteConversation(id: string) {
  console.log('DELETING CONVERSATION', id);
  return await prisma.conversation.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
  });
}
