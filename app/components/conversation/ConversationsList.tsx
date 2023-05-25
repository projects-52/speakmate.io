import type { Character, Conversation, User } from '@prisma/client';
import { Link, NavLink } from '@remix-run/react';
import { PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ConversationPopup from './popups/ConverstauionPopup';
import { format, isToday, isYesterday } from 'date-fns';
import { SettingsBlock } from '../settings/SettingsBlock';
import { useTranslation } from 'react-i18next';

interface ConversationsListProps {
  conversations: Conversation[];
  user: User;
}

type ConversationsForDay = {
  day: Date;
  conversations: Conversation[];
};

type UniqueCharacters = {
  [key: string]: Character;
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

function getUniqueCharacters(conversations: Conversation[]): Character[] {
  const uniqueCharacters: UniqueCharacters = conversations.reduce(
    (acc: UniqueCharacters, conversation) => {
      if (conversation.character && !acc[conversation.character.slug]) {
        acc[conversation.character.slug] = conversation.character;
      }
      return acc;
    },
    {}
  );

  const result: Character[] = Object.values(uniqueCharacters);

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

  const { t } = useTranslation();

  const uniqueCharacters = getUniqueCharacters(conversations);

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
    <div className="h-full flex flex-col overflow-hidden flex-auto max-w-[280px]">
      <div className="p-4 flex gap-2 items-center justify-between ">
        <div className="w-10 h-10 bg-blue-300 rounded-full  border-b border-slate-200" />
        <Link
          to="/app/dashboard/new"
          className="p-2 rounded  flex items-center justify-center gap-2 text-slate-500"
        >
          <PlusIcon className="w-6 h-6" />
          {t('conversations.new')}
        </Link>
      </div>

      {uniqueCharacters.length > 1 && (
        <div className="flex py-2 px-4">
          <div
            className={`flex flex-col items-center justify-center mr-2 cursor-pointer w-10 h-10 bg-slate-200 rounded-full border-2 ${
              selectedCharacter === null ? 'border-blue-500' : ''
            }`}
            onClick={() => setSelectedCharacter(null)}
          >
            {t('conversations.all')}
          </div>
          {uniqueCharacters.map((character) => (
            <div
              key={character.slug}
              className="flex flex-col items-center justify-center"
              onClick={() => setSelectedCharacter(character)}
            >
              <img
                className={`w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center mr-2 cursor-pointer border-2 ${
                  selectedCharacter?.slug === character.slug
                    ? 'border-blue-500'
                    : ''
                }`}
                src={`/characters/${character.slug}.png`}
                alt={character.name}
              />
            </div>
          ))}
        </div>
      )}

      <div className="p-2">
        {groupedConversations.map(
          (conversationForDay: ConversationsForDay, index: number) => (
            <div key={index}>
              <p className="mb-2 text-slate-400 ml-2">
                {isToday(conversationForDay.day) ? 'Today' : ''}
                {isYesterday(conversationForDay.day) ? 'Yesterday' : ''}
                {!isToday(conversationForDay.day) &&
                !isYesterday(conversationForDay.day)
                  ? format(conversationForDay.day, 'EEEE, MMMM do')
                  : ''}
              </p>
              <div>
                {conversationForDay.conversations.map((conversation) => (
                  <NavLink
                    to={`/app/dashboard/${conversation.id}`}
                    key={conversation.id}
                    className={({ isActive }) =>
                      `p-2 text-sm text-gray-700 flex items-center rounded-lg max-w-sm mb-2 ${
                        isActive ? 'bg-primary-dark' : ''
                      }`
                    }
                  >
                    <img
                      className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center mr-2"
                      src={`/characters/${conversation.character?.slug}.png`}
                      alt={conversation.character?.name}
                    />
                    <span className="mr-1">{conversation.name}</span>

                    <EllipsisVerticalIcon
                      className="w-8 h-8 justify-self-end text-slate-200 hover:bg-slate-300 rounded-full ml-auto"
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
