import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.service';
import { getAllConversationsForUser } from '~/services/conversation.service';
import { ConversationsList } from '~/components/conversation/ConversationsList';

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
  return (
    <div className="flex h-full bg-primary">
      <ConversationsList conversations={conversations} user={user} />
      <div className="flex-1 relative">
        <Outlet />
        <div className="absolute w-full h-screen left-0 top-0 bg-primary flex items-center justify-center ">
          <span className="text-lg text-gray-600">
            Choose conversation or create new one!
          </span>
        </div>
      </div>
    </div>
  );
}
