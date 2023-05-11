import type { Message, Conversation } from '@prisma/client';
import { useState } from 'react';

type TextInputProps = {
  onMessageReceived: (message: Message) => void;
  conversation: Conversation;
};

export function TextInput({ conversation, onMessageReceived }: TextInputProps) {
  const [text, setText] = useState<string>('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('conversationId', conversation.id);
    formData.append('text', text);

    const response = await fetch('/api/messages/new', {
      method: 'POST',
      body: formData,
    });

    const message = (await response.json()) as Message;

    onMessageReceived(message);

    setText('');
  };

  return (
    <form className="flex w-full gap-4" onSubmit={onSubmit}>
      <textarea
        className="w-full rounded-lg border-slate-500 border p-4"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Send
      </button>
    </form>
  );
}
