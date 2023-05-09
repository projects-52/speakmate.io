import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import {
  createExplanation,
  getAllExplanationsForConversation,
} from '~/services/explanation.service';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (request.method === 'POST') {
    const body = await request.json();

    const { text, messageId } = body;

    const explanation = await createExplanation(text, messageId);

    return json(explanation);
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);

    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
      console.error('No conversationId provided');
      return json([]);
    }

    const explanations = await getAllExplanationsForConversation(
      conversationId
    );

    return json(explanations);
  }
};
