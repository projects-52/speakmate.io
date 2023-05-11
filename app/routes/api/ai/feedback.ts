import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { createFeedback } from '~/services/feedback.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await request.json();

  const messageId = data.messageId as string;

  const feedback = await createFeedback(messageId);

  return json(feedback);
};
