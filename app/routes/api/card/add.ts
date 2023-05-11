import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { createCard } from '~/services/card.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await request.json();

  const { text, messageId } = data;

  const card = await createCard(text, messageId);

  return json(card);
};
