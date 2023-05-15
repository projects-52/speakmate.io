import type { Message } from '@prisma/client';
import { useEffect, useRef } from 'react';

export function useScroll(
  scrollRef: React.RefObject<HTMLDivElement>,
  messageList: Message[],
  loadMoreMessages: Function
) {
  const latestMessageTimestamp = useRef(0);

  useEffect(() => {
    const latestMessageDate = new Date(
      messageList[messageList.length - 1].createdAt
    );

    if (latestMessageDate.getTime() > latestMessageTimestamp.current) {
      latestMessageTimestamp.current = latestMessageDate.getTime();
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messageList, scrollRef]);

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.currentTarget.scrollTop < 100) {
      loadMoreMessages();
    }
  };

  return { onScroll };
}
