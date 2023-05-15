import type { Explanation, Message } from '@prisma/client';

export function getExplanationsForMessage(
  message: Message,
  explanations: Explanation[]
) {
  return explanations.filter(
    (explanation: Explanation) => explanation.messageId === message.id
  );
}
