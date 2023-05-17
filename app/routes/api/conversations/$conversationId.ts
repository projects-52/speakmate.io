import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { deleteConversation } from '~/services/conversation.service';

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return new Response(null, { status: 401 });
  }

  if (request.method !== 'DELETE') {
    return new Response(null, { status: 405 });
  }

  const { conversationId } = params;

  if (!conversationId) {
    return new Response(null, { status: 400 });
  }

  await deleteConversation(conversationId);

  return redirect(`/app/dashboard`);
};
