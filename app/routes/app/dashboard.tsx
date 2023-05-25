import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.service';
import { getAllConversationsForUser } from '~/services/conversation.service';
import { ConversationsList } from '~/components/conversation/ConversationsList';
import { useTranslation } from 'react-i18next';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }

  const conversations = await getAllConversationsForUser(user.id);

  return {
    conversations,
    user,
  };
};

export default function Dashboard() {
  const { conversations, user } = useLoaderData<typeof loader>();

  const { t } = useTranslation();

  return (
    <div className="flex h-full bg-primary">
      <ConversationsList conversations={conversations} user={user} />
      <div className="flex-1 relative">
        <Outlet />
        <div className="absolute w-full h-screen left-0 top-0 bg-primary flex items-center justify-center ">
          <span className="text-lg text-gray-600">
            {t('dashboard.selectConversation')}
          </span>
        </div>
      </div>
    </div>
  );
}
