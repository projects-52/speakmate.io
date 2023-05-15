import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';
import { getMessagesBeforeDate } from '~/services/message.service';

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  const url = new URL(request.url);

  const conversationId = url.searchParams.get('conversationId') as string;
  const before = url.searchParams.get('before') as string;

  const messages = await getMessagesBeforeDate(
    conversationId,
    new Date(before),
    20
  );

  return json(messages);
};
