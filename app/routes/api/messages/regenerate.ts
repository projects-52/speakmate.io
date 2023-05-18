import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { regenerateResponse } from '~/services/message.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await request.json();

  const messageId = data.messageId as string;

  const newMessage = await regenerateResponse(messageId);

  return json(newMessage);
};
