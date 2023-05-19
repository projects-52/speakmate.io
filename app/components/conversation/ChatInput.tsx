import { useState } from 'react';
import { DocumentTextIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import AudioRecorder from '../AudioRecorder';
import type { Message, Conversation } from '@prisma/client';
import { TextInput } from '../TextInput';

interface ChatInputProps {
  onMessageReceived: (message: Message) => void;
  conversation: Conversation;
}

export function ChatInput({ conversation, onMessageReceived }: ChatInputProps) {
  const [type, setType] = useState<'text' | 'voice'>('voice');
  return (
    <div className="flex p-2">
      {/* <div className="flex flex-col gap-2 pr-4">
        <span
          onClick={() => setType('voice')}
          className={`p-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer  ${
            type === 'voice' ? 'bg-slate-300' : 'bg-white hover:bg-slate-200'
          }`}
        >
          <MicrophoneIcon
            className={`w-8 h-8 ${type === 'voice' ? 'text-slate-100' : ''}`}
          />
        </span>
        <span
          onClick={() => setType('text')}
          className={`p-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer  ${
            type === 'text' ? 'bg-slate-300 ' : 'bg-white hover:bg-slate-200'
          }`}
        >
          <DocumentTextIcon
            className={`w-8 h-8 ${type === 'text' ? 'text-slate-100' : ''}`}
          />
        </span>
      </div> */}
      <TextInput
        conversation={conversation}
        onMessageReceived={onMessageReceived}
      />
      {/* {type === 'voice' && (
        <AudioRecorder
          conversation={conversation}
          onMessageReceived={onMessageReceived}
        />
      )} */}
    </div>
  );
}
