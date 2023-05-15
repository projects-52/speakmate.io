/* eslint-disable react/display-name */
import type { Explanation, Message } from '@prisma/client';
import type { LegacyRef } from 'react';
import React from 'react';
import AssistantMessage from './AssistanceMessage';
import UserMessage from './UserMessage';

interface MessageRowProps {
  message: Message;
  explanations: Explanation[];
}

const MessageRow = React.forwardRef(
  (
    { message, explanations }: MessageRowProps,
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
          />
        )}
      </div>
    );
  }
);

export default MessageRow;
