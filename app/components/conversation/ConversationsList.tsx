import type { Conversation } from '@prisma/client';
import { Link, NavLink } from '@remix-run/react';
import { PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ConversationPopup from './popups/ConverstauionPopup';

interface ConversationsListProps {
  conversations: Conversation[];
}

export function ConversationsList({ conversations }: ConversationsListProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >();

  const selectedConversation = conversations.find(
    (conversation: Conversation) => conversation.id === selectedConversationId
  );
  return (
    <div className="h-full">
      <Link
        to="/app/dashboard/new"
        className="p-4 rounded mb-4 flex items-center justify-center gap-2 text-gray-500 border-b border-slate-200"
      >
        <PlusIcon className="w-8 h-8" />
        New conversation
      </Link>

      <div className="p-2">
        {conversations.map((conversation: Conversation) => (
          <NavLink
            to={`/app/dashboard/${conversation.id}`}
            key={conversation.id}
            className={({ isActive }) =>
              `p-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-l max-w-sm ${
                isActive ? 'bg-gray-200' : ''
              }`
            }
          >
            <img
              className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center mr-2"
              src={`/characters/${conversation.character?.slug}.png`}
              alt={conversation.character?.name}
            />
            {conversation.name}
            <EllipsisVerticalIcon
              className="w-8 h-8 justify-self-end ml-auto text-slate-200 hover:bg-slate-300 rounded-full"
              onClickCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedConversationId(conversation.id);
              }}
            />
          </NavLink>
        ))}
      </div>
      {selectedConversation && (
        <ConversationPopup
          conversation={selectedConversation as Conversation | null}
          onClose={() => setSelectedConversationId(null)}
        />
      )}
    </div>
  );
}
