import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import type { Conversation } from '@prisma/client';
import { useState } from 'react';

interface SpeakToggleProps {
  onChange: (value: boolean) => void;
  value: boolean;
  conversation: Conversation;
}

export function SpeakToggle({
  onChange,
  value,
  conversation,
}: SpeakToggleProps) {
  const [loading, setLoading] = useState(false);

  const onToggle = async (value: boolean) => {
    setLoading(true);
    await fetch('/api/settings/conversation', {
      method: 'POST',
      body: JSON.stringify({
        conversationId: conversation.id,
      }),
    });
    setLoading(false);
    onChange(value);
  };

  return (
    <div className="relative justify-self-end ml-auto w-10 h-10">
      {loading && (
        <div className="w-full h-full rounded-full border-4 border-l-blue-300 border-r-transparent border-t-transparent border-b-transparent absolute -top-1 -left-1 animate-spin box-content"></div>
      )}

      {value ? (
        <SpeakerWaveIcon
          className="w-10 h-10 p-2 hover:bg-slate-300 hover:text-slate-50 cursor-pointer rounded-full relative z-10"
          onClick={() => onToggle(false)}
        />
      ) : (
        <SpeakerXMarkIcon
          className="w-10 h-10 p-2 hover:bg-slate-300 hover:text-slate-50 cursor-pointer rounded-full relative z-10"
          onClick={() => onToggle(true)}
        />
      )}
    </div>
  );
}
