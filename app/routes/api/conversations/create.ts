import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { createConversation } from '~/services/conversation.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }

  const conversation = await createConversation(user.id);

  console.log('conversation', conversation);

  if (!conversation) {
    return redirect('/app/dashboard');
  }

  return redirect(`/app/dashboard/${conversation.id}`);
};
