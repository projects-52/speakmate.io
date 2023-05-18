import type { Feedback } from '@prisma/client';
import type { Message } from '@prisma/client';
import { useState } from 'react';
import EditMessagePopup from '../popups/EditMessagePopup';
import FeedbackPopup from '../popups/FeedbackPopup';

interface UserMessageProps {
  message: Message;
  nextMessage?: Message;
  canBeEdited?: boolean;
  onEditMessage: (message: Message, nextMessage?: Message) => void;
}

export default function UserMessage({
  message,
  canBeEdited,
  onEditMessage,
  nextMessage,
}: UserMessageProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const getFedback = async (messageId: string) => {
    setLoading(messageId);
    const response = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId }),
    });
    const feedback = await response.json();
    setFeedback(feedback);
    setLoading(null);
  };

  return (
    <div
      key={message.id}
      className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}
    >
      <div
        className={`${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-300 text-black'
        } inline-block rounded-md px-4 py-2 m-1 max-w-lg`}
      >
        {message.text}

        <div className="mt-2 flex gap-2">
          {canBeEdited && (
            <span
              className="text-xs text-gray-200 cursor-pointer"
              onClick={() => setShowEdit(true)}
            >
              Edit
            </span>
          )}
          <span
            className="text-xs text-gray-200 cursor-pointer"
            onClick={() => getFedback(message.id)}
          >
            {loading === message.id ? 'Loading...' : 'Feedback'}
          </span>
        </div>
      </div>
      <FeedbackPopup
        feedback={feedback}
        open={!!feedback}
        setOpen={() => setFeedback(null)}
      />
      {showEdit && (
        <EditMessagePopup
          message={message}
          nextMessage={nextMessage}
          onClose={() => setShowEdit(false)}
          onEditMessage={onEditMessage}
        />
      )}
    </div>
  );
}
