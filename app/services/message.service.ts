import type { Conversation, Message } from '@prisma/client';
import type { UIMessage } from '~/types/message.types';
import { getConversationById } from './conversation.service';
import { getAnswer, regenerateAnswer } from './openai.service';
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
      include: {
        explanations: true,
        feedbacks: true,
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
      include: {
        explanations: true,
        feedbacks: true,
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
      include: {
        explanations: true,
        feedbacks: true,
      },
    });

    return messages.reverse();
  } catch (error) {
    console.error('ERROR GETTING MESSAGES FOR CONVERSATION', error);
    return [];
  }
}

export async function editMessage(
  messageId: string,
  nextMessageId?: string,
  text?: string
) {
  const message = await getMessageById(messageId);

  const conversation = await getConversationById(
    message?.conversationId as string
  );

  const messages = await getAllMessagesForConversationOrderedByDate(
    conversation?.id as string
  );

  const messagesToProcess = messages
    .filter((m) => m.id !== nextMessageId)
    .map((m) => {
      if (m.id === message?.id) {
        return {
          ...m,
          text: text as string,
        };
      }
      return m;
    });

  const newAnswer = await getAnswer(
    messagesToProcess,
    conversation as Conversation
  );

  const responses = await prisma.$transaction([
    prisma.message.update({
      where: {
        id: message?.id,
      },
      data: {
        text: text as string,
      },
    }),
    nextMessageId
      ? prisma.message.update({
          where: {
            id: nextMessageId as string,
          },
          data: {
            text: newAnswer as string,
          },
        })
      : prisma.message.create({
          data: {
            conversationId: conversation?.id as string,
            text: newAnswer as string,
            role: 'assistant',
          },
        }),
  ]);

  return responses;
}

export async function regenerateResponse(messageId: string): Promise<Message> {
  const message = await getMessageById(messageId);
  const conversation = await getConversationById(
    message?.conversationId as string
  );
  const messages = await getAllMessagesForConversationOrderedByDate(
    conversation?.id as string
  );

  const newResponse = await regenerateAnswer(
    messages,
    conversation as Conversation
  );

  const lastMessage = messages[messages.length - 1];

  const newMessage = await prisma.message.update({
    where: {
      id: lastMessage.id,
    },
    data: {
      text: newResponse as string,
    },
  });

  return newMessage;
}

// Client-side

export async function getMoreMessages(
  messages: UIMessage[],
  conversation: Conversation
): Promise<Message[]> {
  let url = new URL('/api/messages/more', window.location.origin);

  const oldestMessage = messages.sort((a: UIMessage, b: UIMessage) =>
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
