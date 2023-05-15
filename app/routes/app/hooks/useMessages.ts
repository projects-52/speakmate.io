import type { Conversation, Message } from '@prisma/client';
import { useState, useEffect, useMemo } from 'react';
import { getMoreMessages } from '~/services/message.service';

export function useMessages(
  conversation: Conversation,
  initialMessages: Message[]
) {
  const [messageList, setMessageList] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [startReached, setStartReached] = useState(false);

  const loadMoreMessages = async () => {
    if (loading || startReached) {
      return;
    }

    setLoading(true);

    const newMessages = await getMoreMessages(messageList, conversation);

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
      setMessageList(uniqueMessages);
    }

    setLoading(false);
  };

  useEffect(() => {
    setMessageList(initialMessages);
  }, [conversation, initialMessages]);

  const sortedAndFilteredMessages = useMemo(() => {
    return messageList.filter((message: Message) => message.role !== 'system');
  }, [messageList]);

  return { messageList: sortedAndFilteredMessages, loadMoreMessages, loading, setMessageList };
}
