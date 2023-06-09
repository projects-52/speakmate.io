// import { BookmarkIcon } from '@heroicons/react/24/outline';
import type { Message } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import MessageRow from '~/components/conversation/messages/MessageRow';
import { SpeakToggle } from '~/components/conversation/SpeakToggle';
import { TextInput } from '~/components/TextInput';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getMessagesBeforeDate } from '~/services/message.service';
import { useMessages } from '../hooks/useMessages';
import { useScroll } from '../hooks/useScroll';
import { useSpeak } from '../hooks/useSpeak';

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  const conversation = await getConversationById(
    params.conversationId as string
  );

  if (!conversation) {
    return redirect('/app/dashboard');
  }

  const messages = await getMessagesBeforeDate(conversation.id, new Date(), 20);

  return { conversation, messages };
};

export default function Conversation() {
  const { conversation, messages } = useLoaderData<typeof loader>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(conversation.sound);

  const {
    messageList,
    loadMoreMessages,
    setMessageList,
    onEditMessage,
    onUpdateMessage,
    onGetResponse,
  } = useMessages(conversation, messages);

  const { speak } = useSpeak(
    conversation.language,
    conversation.character.gender,
    soundEnabled
  );

  const { onScroll } = useScroll(
    scrollRef,
    messageList as Message[],
    loadMoreMessages
  );

  useEffect(() => {
    if (messages.length === 1) {
      speak(messages[0].text);
    }
  }, [conversation, messages, setMessageList, speak]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  const getResponse = async () => {
    const message = await onGetResponse();
    if (message) {
      speak(message.text);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-light-shades-500 z-10 relative">
      <div className="p-4 flex items-center justify-center">
        <p className="text-gray-600 items-center w-full p-2 grid grid-cols-6">
          <span className="col-start-1 col-end-6">{conversation.name}</span>

          <div className="col-start-6 col-end-7 flex gap-2 justify-end">
            {/* <NavLink
              to="/app/cards"
              className={({ isActive }) =>
                `justify-self-end  rounded-full w-max-[80px] ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
            >
              <BookmarkIcon className="w-10 h-10 p-2" />
            </NavLink> */}

            <SpeakToggle
              onChange={setSoundEnabled}
              value={soundEnabled}
              conversation={conversation}
            />
          </div>
        </p>
      </div>
      <div
        className="overflow-y-auto flex-1 p-4"
        onScroll={onScroll}
        ref={scrollRef}
      >
        {/** @ts-ignore */}
        {messageList.map((message: Message, index) => (
          <MessageRow
            key={message.id}
            // @ts-ignore
            message={message}
            conversation={conversation}
            isLastByUser={
              messageList.filter((m) => m.role === 'user').pop()?.id ===
              message.id
            }
            isLastByAssistant={
              messageList.filter((m) => m.role === 'assistant').pop()?.id ===
              message.id
            }
            onEditMessage={onEditMessage}
            // @ts-ignore
            nextMessage={messageList[index + 1] as Message}
            onUpdateMessage={onUpdateMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="">
        <TextInput
          conversation={conversation}
          onMessageReceived={(message: Message) => {
            // @ts-ignore
            setMessageList((messages) => [...messages, message]);
            getResponse();
          }}
        />
      </div>
    </div>
  );
}
