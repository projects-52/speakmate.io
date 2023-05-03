import type { Message } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import AudioRecorder from '~/components/AudioRecorder';
import AdvicePopup from '~/components/conversation/AdvicePopup';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getAllMessagesForConversation } from '~/services/message.service';

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    return redirect('/auth');
  }

  const conversation = await getConversationById(
    params.conversationId as string
  );

  if (!conversation) {
    return redirect('/app/dashboard');
  }

  const messages = await getAllMessagesForConversation(conversation.id);

  return { conversation, messages };
};

export default function Conversation() {
  const { conversation, messages } = useLoaderData<typeof loader>();
  const [messageList, setMessageList] = useState<Message[]>(messages);
  const [advice, setAdvice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  useEffect(() => {
    setMessageList(messages);
  }, [conversation, messages]);

  // useEffect, that call function scrollIntoView, when messageList changes
  const getResponse = async () => {
    const response = await fetch('/api/ai/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId: conversation.id }),
    });
    const message = await response.json();

    setMessageList((messages) => [...messages, message]);
  };

  const getAdvice = async (messageId: string) => {
    setLoading(messageId);
    const response = await fetch('/api/ai/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId, conversationId: conversation.id }),
    });
    const advice = await response.json();
    setLoading(null);
    setAdvice(advice);
  };

  return (
    <div className="h-screen flex flex-col border-l border-slate-200 bg-white z-10 relative">
      <div className="overflow-y-auto flex-1 p-4">
        {messageList
          .filter((message: Message) => message.role !== 'system')
          .map((message: Message) => (
            <div
              key={message.id}
              className={`${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                } inline-block rounded-md px-4 py-2 m-1 max-w-lg`}
              >
                {message.text}

                {message.role === 'user' && (
                  <div className="border-t mt-2 border-blue-200">
                    <span
                      className="text-xs text-gray-200 cursor-pointer"
                      onClick={() => getAdvice(message.id)}
                    >
                      {loading === message.id ? 'Loading...' : 'Get advice'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <AdvicePopup
        open={!!advice}
        setOpen={() => setAdvice(null)}
        advice={advice}
      />
      <div className="">
        <AudioRecorder
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
