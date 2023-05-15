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
}

const MessageRow = React.forwardRef(
  (
    { message, explanations, conversation }: MessageRowProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    return (
      <div ref={ref}>
        {message.role === 'user' ? (
          <UserMessage message={message} key={message.id} />
        ) : (
          <AssistantMessage
            message={message}
            key={message.id}
            explanations={explanations}
            conversation={conversation}
          />
        )}
      </div>
    );
  }
);

export default MessageRow;
