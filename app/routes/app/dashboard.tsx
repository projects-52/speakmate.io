import type { Conversation } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.service';
import { getAllConversationsForUser } from '~/services/conversation.service';
import { PlusIcon } from '@heroicons/react/24/outline';

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
  };
};

export default function Dashboard() {
  const { conversations } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full">
      <div className="h-full">
        {/* <Link
          to="/app/dashboard/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-4"
        >
          Add conversation
        </Link> */}
        <Form method="post" action="/api/conversations/create">
          <button
            type="submit"
            className="p-4 rounded mb-4 flex items-center justify-center gap-2 text-gray-500 border-b border-slate-200"
          >
            <PlusIcon className="w-8 h-8" />
            Add conversation
          </button>
        </Form>
        <div className="p-2">
          {conversations.map((conversation: Conversation) => (
            <NavLink
              to={`/app/dashboard/${conversation.id}`}
              key={conversation.id}
              className={({ isActive }) =>
                `p-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-l ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
            >
              <span className="w-8 h-8 p-2 rounded-full bg-slate-300 text-white flex items-center justify-center mr-4">
                EN
              </span>
              {conversation.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
