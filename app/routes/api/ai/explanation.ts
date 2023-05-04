import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getMessageById } from '~/services/message.service';
import { getExplanation } from '~/services/openai.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }

  const data = await request.json();

  const text = data.text as string;
  const messageId = data.messageId as string;

  const message = await getMessageById(messageId);

  if (!message) {
    return null;
  }

  const conversation = await getConversationById(message.conversationId);

  if (!conversation) {
    return null;
  }

  const advice = await getExplanation(message, conversation, text);

  if (!advice) {
    return null;
  }

  return json(advice);
};
