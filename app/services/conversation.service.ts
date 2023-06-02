import type { Conversation } from '@prisma/client';
import type { Character } from '~/types/character.type';
import { createMessage } from './message.service';
import { getInitialMesage } from './openai.service';
import { prisma } from './prisma.service';
import { initialMessageParser } from '../prompts';
import { getRandomeLearningStyle } from '~/prompts/learningStyles';

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

  const style = getRandomeLearningStyle();

  try {
    const conversationData = {
      userId,
      name,
      language,
      native,
      level,
      topic,
      deleted: false,
      style,
      character: {
        slug: characterData.slug,
        name: characterData.name,
        personality: characterData.personality,
        gender: characterData.gender,
      },
    };
    const data = await getInitialMesage(conversationData);

    const parsedData = await initialMessageParser.parse(data as string);

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
  return await prisma.conversation.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
  });
}

export async function toggleSoundForConversation(
  conversationId: string
): Promise<Conversation> {
  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      sound: !conversation.sound,
    },
  });
}
