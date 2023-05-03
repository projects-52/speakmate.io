import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getMessageById } from '~/services/message.service';
import { getAdvice } from '~/services/openai.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }

  const data = await request.json();

  const conversationId = data.conversationId as string;
  const messageId = data.messageId as string;

  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    return null;
  }

  const message = await getMessageById(messageId);

  if (!message) {
    return null;
  }

  const advice = await getAdvice(message, conversation);

  if (!advice) {
    return null;
  }

  return json(advice);
};
