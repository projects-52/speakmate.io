import type { ActionFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { toggleSoundForConversation } from '~/services/conversation.service';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await request.json();
  const { conversationId } = data;

  try {
    await toggleSoundForConversation(conversationId);

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error('ERROR TOGGLING SOUND FOR CONVERSATION', error);
    return new Response(null, { status: 500 });
  }
};
