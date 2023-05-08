import type { Message } from '@prisma/client';

export async function getNextMessageForConversation(
  conversationId: string
): Promise<Message> {
  const response = await fetch('/api/ai/response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversationId }),
  });
  const message = await response.json();

  return message;
}
