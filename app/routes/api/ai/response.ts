import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import {
  createMessage,
  getAllMessagesForConversationOrderedByDate,
} from '~/services/message.service';
import { getAnswer } from '~/services/openai.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }

  const data = await request.json();

  const conversationId = data.conversationId as string;

  const messages = await getAllMessagesForConversationOrderedByDate(
    conversationId
  );

  const response = await getAnswer(messages);

  if (!response) {
    return null;
  }

  const message = await createMessage(conversationId, response, 'assistant');

  return json(message);
};
