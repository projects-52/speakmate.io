import type { Message } from '@prisma/client';
import { useState } from 'react';

interface UserMessageProps {
  message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);

  const getAdvice = async (messageId: string) => {
    setLoading(messageId);
    const response = await fetch('/api/ai/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId }),
    });
    const advice = await response.json();
    setLoading(null);
    setAdvice(advice);
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
          <div className="border-t mt-2 border-blue-200">
            <span
              className="text-xs text-gray-200 cursor-pointer"
              onClick={() => getAdvice(message.id)}
            >
              {loading === message.id ? 'Loading...' : 'Get advice'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
