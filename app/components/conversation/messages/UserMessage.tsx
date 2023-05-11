import type { Feedback, Message } from '@prisma/client';
import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import FeedbackPopup from '../popups/FeedbackPopup';

interface UserMessageProps {
  message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

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

        {message.role === 'user' && (
          <div className="mt-2">
            <span
              className="text-xs text-gray-200 cursor-pointer"
              onClick={() => getFedback(message.id)}
            >
              {loading === message.id ? (
                'Loading...'
              ) : (
                <QuestionMarkCircleIcon className="w-4 h-4" />
              )}
            </span>
          </div>
        )}
      </div>
      <FeedbackPopup
        feedback={feedback}
        open={!!feedback}
        setOpen={() => setFeedback(null)}
      />
    </div>
  );
}
