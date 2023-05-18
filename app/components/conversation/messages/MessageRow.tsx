/* eslint-disable react/display-name */
import type { Conversation, Explanation, Message } from '@prisma/client';
import type { LegacyRef } from 'react';
import React from 'react';
import AssistantMessage from './AssistanceMessage';
import UserMessage from './UserMessage';

interface MessageRowProps {
  message: Message;
  explanations: Explanation[];
  conversation: Conversation;
  isLastByUser: boolean;
  isLastByAssistant: boolean;
  onEditMessage: (message: Message, nextMessage?: Message) => void;
  nextMessage?: Message;
  onUpdateMessage: (message: Message) => void;
}

const MessageRow = React.forwardRef(
  (
    {
      message,
      explanations,
      conversation,
      isLastByUser,
      onEditMessage,
      nextMessage,
      isLastByAssistant,
      onUpdateMessage,
    }: MessageRowProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    return (
      <div ref={ref}>
        {message.role === 'user' ? (
          <UserMessage
            message={message}
            key={message.id}
            canBeEdited={isLastByUser}
            onEditMessage={onEditMessage}
            nextMessage={nextMessage}
          />
        ) : (
          <AssistantMessage
            message={message}
            key={message.id}
            explanations={explanations}
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
