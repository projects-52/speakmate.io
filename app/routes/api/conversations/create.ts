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

  const formData = await request.formData();

  const language = formData.get('language') as string;
  const level = formData.get('level') as string;
  const native= formData.get('native') as string;
  const name = `${language} ${level}`;



  const conversation = await createConversation(user.id, name, language, native, level);

  if (!conversation) {
    return redirect('/app/dashboard');
  }

  return redirect(`/app/dashboard/${conversation.id}`);
};
