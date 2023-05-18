import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { editMessage } from '~/services/message.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await request.json();

  const { messageId, nextMessageId, text } = data;

  const responses = await editMessage(messageId, nextMessageId, text);

  return json(responses);
};
