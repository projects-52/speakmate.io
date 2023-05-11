import type { Feedback } from '@prisma/client';
import { getConversationById } from './conversation.service';
import { getMessageById } from './message.service';
import { getFeedback } from './openai.service';
import { prisma } from './prisma.service';

export async function createFeedback(
  messageId: string
): Promise<Feedback | null> {
  const message = await getMessageById(messageId);

  if (!message) {
    return null;
  }

  const existingFeedback = await getFeedbackByMessageId(messageId);

  if (existingFeedback) {
    return existingFeedback;
  }

  const conversation = await getConversationById(message.conversationId);

  if (!conversation) {
    return null;
  }

  let text;

  try {
    const feedbackText = await getFeedback(message, conversation);
    text = JSON.parse(feedbackText as string);
  } catch (error) {
    console.error(error);
    return null;
  }

  const feedback = prisma.feedback.create({
    data: {
      messageId,
      text,
      conversationId: conversation.id,
    },
  });

  return feedback;
}

export async function getFeedbackByMessageId(
  messageId: string
): Promise<Feedback | null> {
  const feedback = await prisma.feedback.findFirst({
    where: {
      messageId,
    },
  });

  return feedback;
}
