/* eslint-disable react/display-name */
import type { Conversation } from '@prisma/client';
import type { LegacyRef } from 'react';
import React from 'react';
import type { UIMessage } from '~/types/message.types';
import AssistantMessage from './AssistanceMessage';
import { LoadingMessage } from './LoadingMessage';
import UserMessage from './UserMessage';

interface MessageRowProps {
  message: UIMessage;
  conversation: Conversation;
  isLastByUser: boolean;
  isLastByAssistant: boolean;
  onEditMessage: (message: UIMessage, nextMessage?: UIMessage) => void;
  nextMessage?: UIMessage;
  onUpdateMessage: (message: UIMessage) => void;
}

const MessageRow = React.forwardRef(
  (
    {
      message,
      conversation,
      isLastByUser,
      onEditMessage,
      nextMessage,
      isLastByAssistant,
      onUpdateMessage,
    }: MessageRowProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    if (message.role === 'loading') {
      return <LoadingMessage conversation={conversation} />;
    }

    return (
      <div ref={ref}>
        {message.role === 'user' ? (
          <UserMessage
            message={message}
            key={message.id}
            canBeEdited={isLastByUser}
            // @ts-ignore
            onEditMessage={onEditMessage}
            // @ts-ignore
            nextMessage={nextMessage}
          />
        ) : (
          <AssistantMessage
            message={message}
            key={message.id}
            conversation={conversation}
            canBeEdited={isLastByAssistant}
            onUpdateMessage={onUpdateMessage}
          />
        )}
      </div>
    );
  }
);

export default MessageRow;
