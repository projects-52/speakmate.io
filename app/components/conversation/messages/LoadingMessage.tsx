import type { Conversation } from '@prisma/client';

interface LoadingMessageProps {
  conversation: Conversation;
}

export function LoadingMessage({ conversation }: LoadingMessageProps) {
  return (
    <div className="flex gap-2">
      <img
        src={`/characters/${conversation.character?.slug}.png`}
        className="w-12 h-12 rounded-full"
        alt={conversation.character?.name}
      />
      <div className="bg-gray-200 text-black inline-block rounded-md px-4 py-2 max-w-lg">
        <p className="text-gray-500 text-sm mb-1">
          {conversation.character?.name}
        </p>
        <p className="relative">
          <div className="h-8 w-24 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 message-loading animation-delay-1"></div>
            <div className="w-4 h-4 rounded-full bg-gray-400 message-loading animation-delay-2"></div>
            <div className="w-4 h-4 rounded-full bg-gray-400 message-loading animation-delay-3"></div>
          </div>
        </p>
      </div>
    </div>
  );
}
