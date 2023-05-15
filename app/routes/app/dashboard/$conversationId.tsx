import type { Message } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { ChatInput } from '~/components/conversation/ChatInput';
import MessageRow from '~/components/conversation/messages/MessageRow';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getAllExplanationsForConversation } from '~/services/explanation.service';
import { getMessagesBeforeDate } from '~/services/message.service';
import { getNextMessageForConversation } from '~/services/response.service';
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

  const { onScroll } = useScroll(scrollRef, messageList, loadMoreMessages);

  useEffect(() => {
    setMessageList(messages);
  }, [conversation, messages, setMessageList]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  const getResponse = async () => {
    const message = await getNextMessageForConversation(conversation.id);
    setMessageList((messages) => [...messages, message]);
  };

  return (
    <div className="h-screen flex flex-col border-l border-slate-200 bg-white z-10 relative">
      <div
        className="overflow-y-auto flex-1 p-4"
        onScroll={onScroll}
        ref={scrollRef}
      >
        {messageList.map((message: Message) => (
          <MessageRow
            key={message.id}
            message={message}
            explanations={getExplanationsForMessage(message, explanations)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="">
        <ChatInput
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
