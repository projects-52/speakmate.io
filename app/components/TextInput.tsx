import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { Message, Conversation } from '@prisma/client';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import AudioRecorder from './AudioRecorder';

type TextInputProps = {
  onMessageReceived: (message: Message) => void;
  conversation: Conversation;
};

export function TextInput({ conversation, onMessageReceived }: TextInputProps) {
  const [text, setText] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);
  const [audioDisabled, setAudioDisabled] = useState<boolean>(false);

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

  const onFocus = () => {
    setFocused(true);
    setAudioDisabled(true);
  };

  const onBlur = () => {
    setFocused(false);
    setAudioDisabled(false);
  };

  return (
    <div className="p-4 bg-primary">
      <form
        className={`flex w-full gap-4 rounded-3xl py-2 px-4 resize-none overflow-hidden bg-slate-50 border-2 items-center shadow-sm ${
          focused ? 'border-blue-400' : 'border-transparent'
        }`}
        onSubmit={onSubmit}
      >
        <div className="flex items-center justify-center border-r border-slate-200 pr-4">
          <AudioRecorder
            conversation={conversation}
            onMessageReceived={onMessageReceived}
            disabled={audioDisabled}
          />
        </div>
        <TextareaAutosize
          className="w-full resize-none border-0 outline-none bg-slate-50"
          onChange={(e) => setText(e.target.value)}
          value={text}
          maxRows={3}
          minRows={2}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button type="submit" className="flex h-full items-center ">
          <PaperAirplaneIcon className="w-10 h-10 p-2 text-slate-500 rounded-full hover:bg-blue-200 hover:text-slate-50" />
        </button>
      </form>
    </div>
  );
}
