import type { Message } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { addSeconds } from 'date-fns';
import { useEffect, useRef } from 'react';
import MessageRow from '~/components/conversation/messages/MessageRow';
import { TextInput } from '~/components/TextInput';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getAllExplanationsForConversation } from '~/services/explanation.service';
import { getMessagesBeforeDate } from '~/services/message.service';
import { getNextMessageForConversation } from '~/services/response.service';
import { speak } from '~/services/speak.service';
import { getExplanationsForMessage } from '~/utils/explanations';
import { useMessages } from '../hooks/useMessages';
import { useScroll } from '../hooks/useScroll';

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

  const explanations = await getAllExplanationsForConversation(conversation.id);

  return { conversation, messages, explanations };
};

export default function Conversation() {
  const { conversation, messages, explanations } =
    useLoaderData<typeof loader>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { messageList, loadMoreMessages, setMessageList } = useMessages(
    conversation,
    messages
  );

  const { onScroll } = useScroll(
    scrollRef,
    messageList as Message[],
    loadMoreMessages
  );

  useEffect(() => {
    setMessageList(messages);
    if (messages.length === 1) {
      speak(
        messages[0].text,
        conversation.character.gender,
        conversation.language
      );
    }
  }, [conversation, messages, setMessageList]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  const getResponse = async () => {
    setMessageList((messages: Partial<Message>[]) => [
      ...messages,
      {
        role: 'loading',
        createdAt: addSeconds(
          new Date(messages[messages.length - 1].createdAt as Date) as Date,
          1
        ).toISOString(),
      } as unknown as Partial<Message>,
    ]);
    const message = (await getNextMessageForConversation(
      conversation.id
    )) as Message;
    speak(message.text, conversation.character.gender, conversation.language);
    // @ts-ignore
    setMessageList((messages: Partial<Message>[]) => [
      ...messages.map((m: Partial<Message>) => {
        if (m.role === 'loading') {
          return message as unknown as Partial<Message>;
        }
        return m as unknown as Partial<Message>;
      }),
    ]);
  };

  const onEditMessage = async (message: Message, nextMessage?: Message) => {
    // @ts-ignore
    setMessageList((messages: Message[]) =>
      messages.map((m) => {
        if (m.id === message.id) {
          return message;
        }
        if (m.id === nextMessage?.id) {
          return nextMessage;
        }
        return m;
      })
    );
  };

  const onUpdateMessage = async (message: Message) => {
    // @ts-ignore
    setMessageList((messages: Message[]) =>
      messages.map((m) => {
        if (m.id === message.id) {
          return message;
        }
        return m;
      })
    );
  };

  return (
    <div className="h-screen flex flex-col bg-primary z-10 relative">
      <div className="p-4 flex items-center justify-center">
        <p className="text-gray-600 h-10 flex items-center">
          {conversation.name}
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
            message={message}
            explanations={getExplanationsForMessage(message, explanations)}
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
            setMessageList((messages) => [...messages, message]);
            getResponse();
          }}
        />
      </div>
    </div>
  );
}
