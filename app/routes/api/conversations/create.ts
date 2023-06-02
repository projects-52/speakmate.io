import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { createConversation } from '~/services/conversation.service';
import { Characters } from '~/characters';
import type { Character } from '~/types/character.type';

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
  const native = formData.get('native') as string;
  const topic = formData.get('topic') as string;
  const character = formData.get('character') as string;
  const name = `${language} ${level}`;

  const characterData = Characters[language].find(
    (c: Character) => c.slug === character
  ) as Character;

  const conversation = await createConversation(
    user.id,
    name,
    language,
    native,
    level,
    topic,
    characterData
  );

  if (!conversation) {
    return redirect('/app/dashboard');
  }

  return redirect(`/app/dashboard/${conversation.id}`);
};
