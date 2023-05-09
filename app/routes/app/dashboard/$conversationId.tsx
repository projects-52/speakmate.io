import type { Explanation, Message } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import AudioRecorder from '~/components/AudioRecorder';
import AdvicePopup from '~/components/conversation/AdvicePopup';
import AssistantMessage from '~/components/conversation/messages/AssistanceMessage';
import UserMessage from '~/components/conversation/messages/UserMessage';
import { authenticator } from '~/services/auth.service';
import { getConversationById } from '~/services/conversation.service';
import { getAllExplanationsForConversation } from '~/services/explanation.service';
import { getAllMessagesForConversation } from '~/services/message.service';
import { getNextMessageForConversation } from '~/services/response.service';

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

  const messages = await getAllMessagesForConversation(conversation.id);

  const explanations = await getAllExplanationsForConversation(conversation.id);

  return { conversation, messages, explanations };
};

export default function Conversation() {
  const { conversation, messages, explanations } =
    useLoaderData<typeof loader>();
  const [messageList, setMessageList] = useState<Message[]>(messages);
  const [advice, setAdvice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  useEffect(() => {
    setMessageList(messages);
  }, [conversation, messages]);

  const getResponse = async () => {
    const message = await getNextMessageForConversation(conversation.id);
    setMessageList((messages) => [...messages, message]);
  };

  const getExplanationsForMessage = (message: Message) => {
    const e = explanations.filter(
      (explanation: Explanation) => explanation.messageId === message.id
    );

    return e;
  };

  return (
    <div className="h-screen flex flex-col border-l border-slate-200 bg-white z-10 relative">
      <div className="overflow-y-auto flex-1 p-4">
        {messageList
          .filter((message: Message) => message.role !== 'system')
          .map((message: Message) =>
            message.role === 'user' ? (
              <UserMessage message={message} key={message.id} />
            ) : (
              <AssistantMessage
                message={message}
                key={message.id}
                explanations={getExplanationsForMessage(message)}
              />
            )
          )}
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
