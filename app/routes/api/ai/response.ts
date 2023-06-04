import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import {
  getConversationById,
  updateConversationSummary,
} from '~/services/conversation.service';
import {
  createMessage,
  getAllMessagesForConversationOrderedByDate,
} from '~/services/message.service';
import { createSummary, getAnswer } from '~/services/openai.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }
  console.time('response');
  const data = await request.json();

  const conversationId = data.conversationId as string;

  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    return null;
  }

  const messages = await getAllMessagesForConversationOrderedByDate(
    conversationId
  );

  const [response, summary] = await Promise.all([
    getAnswer(messages, conversation),
    createSummary(messages, conversation),
  ]);

  // const response = await getAnswer(messages, conversation);

  // const summary = await createSummary(messages, conversation);

  await updateConversationSummary(conversationId, summary as string);

  console.log('-- RESPONSE', response);

  console.log('-- SUMMARY', summary);

  if (!response) {
    return null;
  }

  const message = await createMessage(conversationId, response, 'assistant');
  console.timeEnd('response');
  return json(message);
};
