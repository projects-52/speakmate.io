import type { Conversation, Message } from '@prisma/client';
import { prisma } from './prisma.service';

export async function createMessage(
  conversationId: string,
  text: string,
  role: string
): Promise<Message | null> {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        text,
        role,
      },
    });
    return message;
  } catch (error) {
    console.error('ERROR CREATING MESSAGE', error);
    return null;
  }
}

export async function getAllMessagesForConversationOrderedByDate(
  conversationId: string
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  } catch (error) {
    console.error('ERROR GETTING MESSAGES FOR CONVERSATION', error);
    return [];
  }
}

export async function getMessageById(id: string) {
  try {
    return await prisma.message.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error('ERROR GETTING MESSAGE BY ID', error);
    return null;
  }
}

export async function getMessagesBeforeDate(
  conversationId: string,
  date: Date,
  limit: number
) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        createdAt: {
          lt: date,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages.reverse();
  } catch (error) {
    console.error('ERROR GETTING MESSAGES FOR CONVERSATION', error);
    return [];
  }
}

// Client-side

export async function getMoreMessages(
  messages: Message[],
  conversation: Conversation
): Promise<Message[]> {
  let url = new URL('/api/messages/more', window.location.origin);

  const oldestMessage = messages.sort((a: Message, b: Message) =>
    a.createdAt < b.createdAt ? -1 : 1
  )[0];

  if (
    oldestMessage.createdAt.toString() === conversation.createdAt.toString()
  ) {
    return [];
  }

  let params: Record<string, string> = {
    conversationId: conversation.id,
    before: oldestMessage.createdAt.toString(),
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const response = await fetch(url);

  if (response.ok) {
    return await response.json();
  }

  return [];
}
