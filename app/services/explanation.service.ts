import type { Explanation, Message } from '@prisma/client';
import { explanationParser } from '~/prompts';
import { generateHash } from '~/utils/hash';
import { getConversationById } from './conversation.service';
import { getMessageById } from './message.service';
import { getExplanation } from './openai.service';
import { prisma } from './prisma.service';

export async function createExplanation(
  textToExplain: string,
  messageId: string
): Promise<Explanation | null> {
  const message = await getMessageById(messageId);

  if (!message) {
    return null;
  }

  const conversation = await getConversationById(message.conversationId);

  if (!conversation) {
    return null;
  }

  const hash = generateHash(`${textToExplain}, ${message.text}`);

  const existingExplanation = await getExplanationByHash(hash);

  if (existingExplanation) {
    return existingExplanation;
  }
  const explanationString = await getExplanation(
    message,
    conversation,
    textToExplain
  );

  if (!explanationString) {
    return null;
  }

  let explanationText;

  try {
    explanationText = await explanationParser.parse(explanationString);
  } catch (error) {
    console.error(error);
    return null;
  }

  const explanation = await prisma.explanation.create({
    data: {
      textToExplain,
      messageId,
      explanation: explanationText as any,
      hash,
      conversationId: conversation.id,
    },
  });

  return explanation;
}

export async function getAllExplanationsForConversation(
  conversationId: string
): Promise<Explanation[]> {
  const explanations = await prisma.explanation.findMany({
    where: {
      conversationId,
    },
  });

  return explanations;
}

export async function getExplanationByHash(
  hash: string
): Promise<Explanation | null> {
  const explanation = await prisma.explanation.findFirst({
    where: {
      hash,
    },
  });

  return explanation;
}

// Client-side

export async function explainText(
  text: string,
  message: Message
): Promise<Explanation> {
  const response = await fetch('/api/ai/explanation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, messageId: message.id }),
  });

  const explanation = await response.json();

  return explanation;
}
