import type { Card } from '@prisma/client';
import { cardExplanationParser } from '~/prompts';
import { getConversationById } from './conversation.service';
import { getMessageById } from './message.service';
import { getCardExplanation } from './openai.service';
import { prisma } from './prisma.service';

export async function createCard(
  text: string,
  messageId: string
): Promise<Card | null> {
  const message = await getMessageById(messageId);

  if (!message) {
    return null;
  }

  const conversation = await getConversationById(message.conversationId);

  if (!conversation) {
    return null;
  }

  let explanation;

  try {
    const explanationString = await getCardExplanation(
      message,
      conversation,
      text
    );
    explanation = (await cardExplanationParser.parse(
      explanationString as string
    )) as any;
  } catch (error) {}


  const card = prisma.card.create({
    data: {
      text,
      explanation,
      userId: conversation.userId,
      language: conversation.language as string,
    },
  });

  return card;
}

export async function getAllCardsByUserId(userId: string): Promise<Card[]> {
  const cards = await prisma.card.findMany({
    where: {
      userId,
    },
  });

  return cards;
}

export async function getCardByText(
  text: string,
  userId: string
): Promise<Card | null> {
  try {
    const card = await prisma.card.findFirst({
      where: {
        text,
        userId,
      },
    });

    return card;
  } catch (error) {
    console.error(error);
    return null;
  }
}
