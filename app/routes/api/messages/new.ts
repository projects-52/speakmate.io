import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { createMessage } from '~/services/message.service';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  const formData = await request.formData();

  const conversationId = formData.get('conversationId') as string;
  const text = formData.get('text') as string;

  const message = await createMessage(conversationId, text, 'user');

  return json(message);
};
