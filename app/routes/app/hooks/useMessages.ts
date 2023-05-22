import type { Conversation, Message } from '@prisma/client';
import { addSeconds } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { getMoreMessages } from '~/services/message.service';
import { getNextMessageForConversation } from '~/services/response.service';
import type { UIMessage } from '~/types/message.types';

export function useMessages(
  conversation: Conversation,
  initialMessages: UIMessage[]
) {
  const [messageList, setMessageList] = useState<UIMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [startReached, setStartReached] = useState(false);

  const loadMoreMessages = async () => {
    if (loading || startReached) {
      return;
    }

    setLoading(true);

    const newMessages = await getMoreMessages(
      messageList as UIMessage[],
      conversation
    );

    const combinedMessages = [...newMessages, ...messageList];

    const uniqueMessageIds = new Set();
    const uniqueMessages = [];

    for (const message of combinedMessages) {
      if (!uniqueMessageIds.has(message.id)) {
        uniqueMessageIds.add(message.id);
        uniqueMessages.push(message);
      }
    }

    if (newMessages.length === 0) {
      setStartReached(true);
    } else {
      setMessageList(uniqueMessages as UIMessage[]);
    }

    setLoading(false);
  };

  const onEditMessage = async (message: UIMessage, nextMessage?: UIMessage) => {
    setMessageList((messages: UIMessage[]) =>
      messages.map((m: UIMessage) => {
        if (m.id === message.id) {
          return message as UIMessage;
        }
        if (m.id === nextMessage?.id) {
          return nextMessage as UIMessage;
        }
        return m;
      })
    );
  };

  const onUpdateMessage = async (message: UIMessage) => {
    setMessageList((messages: UIMessage[]) =>
      messages.map((m) => {
        if (m.id === message.id) {
          return message;
        }
        return m;
      })
    );
  };

  const onGetResponse = async () => {
    setMessageList((messages: UIMessage[]) => [
      ...messages,
      {
        role: 'loading',
        createdAt: addSeconds(
          new Date(messages[messages.length - 1].createdAt as Date) as Date,
          1
        ).toISOString(),
      } as UIMessage,
    ]);
    const message = (await getNextMessageForConversation(
      conversation.id
    )) as Message;
    setMessageList((messages: UIMessage[]) => [
      ...messages.map((m: UIMessage) => {
        if (m.role === 'loading') {
          return message as UIMessage;
        }
        return m as UIMessage;
      }),
    ]);

    return message;
  };

  useEffect(() => {
    setMessageList(initialMessages);
  }, [conversation, initialMessages]);

  const sortedAndFilteredMessages = messageList.filter(
    (message: UIMessage) => message.role !== 'system'
  );

  return {
    messageList: sortedAndFilteredMessages,
    loadMoreMessages,
    loading,
    setMessageList,
    onEditMessage,
    onUpdateMessage,
    onGetResponse,
  };
}
