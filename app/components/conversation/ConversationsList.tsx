import type { Character, Conversation, User } from '@prisma/client';
import { Link, NavLink } from '@remix-run/react';
import { PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ConversationPopup from './popups/ConverstauionPopup';
import { SettingsBlock } from '../settings/SettingsBlock';
import { CharactersFilter } from './CharactersFilter';
import { DateComponent } from '../ui/Date';
import { Logo } from '../ui/Logo';

interface ConversationsListProps {
  conversations: Conversation[];
  user: User;
}

type ConversationsForDay = {
  day: Date;
  conversations: Conversation[];
};

function groupByDay(conversations: Conversation[]): ConversationsForDay[] {
  const grouped = conversations.reduce(
    (grouped: { [key: string]: Conversation[] }, conversation) => {
      const date = new Date(conversation.createdAt).toISOString().split('T')[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(conversation);

      return grouped;
    },
    {}
  );

  const result: ConversationsForDay[] = Object.keys(grouped).map((day) => ({
    day: new Date(day),
    conversations: grouped[day],
  }));

  return result;
}

export function ConversationsList({
  conversations,
  user,
}: ConversationsListProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const selectedConversation = conversations.find(
    (conversation: Conversation) => conversation.id === selectedConversationId
  );

  const groupedConversations = groupByDay(
    [...conversations]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .filter(
        (conversation) =>
          conversation.character?.slug === selectedCharacter?.slug ||
          !selectedCharacter
      )
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden flex-auto max-w-[80px] md:max-w-[280px]">
      <div className="p-4 flex gap-2 items-center justify-center md:justify-between md:flex-nowrap flex-wrap md:pr-8">
        <Logo />
        <Link
          to="/app/dashboard/new"
          className="flex items-center justify-center gap-2 text-light-shades-500 bg-light-accent-100 hover:bg-light-accent-300 rounded-full"
        >
          <PlusIcon className="w-10 h-10 p-2" />
          {/* <span className="hidden md:block">{t('conversations.new')}</span> */}
        </Link>
      </div>

      <CharactersFilter
        conversations={conversations}
        onCharacterSelect={(c) => setSelectedCharacter(c)}
        selectedCharacter={selectedCharacter}
      />
      <div className="p-2 flex-1 overflow-y-auto">
        {groupedConversations.map(
          (conversationForDay: ConversationsForDay, index: number) => (
            <div key={index}>
              <p className="mb-2 text-dark-shades-300 ml-2 hidden md:block capitalize">
                <DateComponent date={conversationForDay.day} />
              </p>
              <p className="mb-2 text-dark-shades-300 md:hidden text-sm text-center">
                <DateComponent date={conversationForDay.day} format="dd.MM" />
              </p>
              <div>
                {conversationForDay.conversations.map((conversation) => (
                  <NavLink
                    to={`/app/dashboard/${conversation.id}`}
                    key={conversation.id}
                    className={({ isActive }) =>
                      `p-2 text-sm text-gray-700 flex items-center rounded-lg max-w-sm mb-2 justify-center md:justify-normal ${
                        isActive
                          ? 'bg-light-shades-700 hover:bg-light-shades-700 editable-conversation'
                          : 'hover:bg-light-shades-600 non-editable-conversation'
                      }`
                    }
                  >
                    <img
                      className="w-10 h-10 rounded-full flex items-center justify-center md:mr-2"
                      src={`/characters/${conversation.character?.slug}.png`}
                      alt={conversation.character?.name}
                    />
                    <span className="mr-1 hidden md:block">
                      {conversation.name}
                    </span>

                    <EllipsisVerticalIcon
                      className="w-8 h-8 justify-self-end text-slate-200 hover:text-slate-400 rounded-full ml-auto flex-shrink-0 hidden"
                      onClickCapture={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedConversationId(conversation.id);
                      }}
                    />
                  </NavLink>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <SettingsBlock user={user} />
      {selectedConversation && (
        <ConversationPopup
          conversation={selectedConversation as Conversation | null}
          onClose={() => setSelectedConversationId(null)}
        />
      )}
    </div>
  );
}
