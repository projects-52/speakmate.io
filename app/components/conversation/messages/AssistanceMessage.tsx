import type { Conversation, Explanation, Message } from '@prisma/client';
import { useState, useRef, useEffect } from 'react';
import ExplanationPopup from '../popups/ExplanationPopup';
import LoadingSkeleton from './LoadingSkeleton';
import { format } from 'date-fns';

interface AssistantMessageProps {
  message: Message;
  explanations: Explanation[];
  conversation: Conversation;
  canBeEdited: boolean;
  onUpdateMessage: (message: Message) => void;
}

export default function AssistantMessage({
  message,
  explanations,
  conversation,
  canBeEdited,
  onUpdateMessage,
}: AssistantMessageProps) {
  const [selectedText, setSelectedText] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    bottom: number;
    left: number;
  } | null>(null);
  const [explanation, setExplanation] = useState<Explanation>();
  const [loading, setLoading] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      console.log('mouse up');

      // @ts-ignore
      if (e.currentTarget?.dataset?.button === 'card') {
        return;
      }
      setExplanation(undefined);
      const selection = window.getSelection();
      // @ts-ignore
      const selectedText = selection.toString();

      setSelectedText(selectedText);
      setTooltipVisible(!!selectedText);

      if (selectedText && messageRef.current) {
        // @ts-ignore
        const range = selection.getRangeAt(0);
        const position = range.getBoundingClientRect();
        const messageRect = messageRef.current.getBoundingClientRect();

        setTooltipPosition({
          bottom: messageRect.bottom - position.bottom,
          left: position.left - messageRect.left,
        });
      } else {
        setTooltipPosition(null);
      }
    };

    if (messageRef.current) {
      messageRef.current.addEventListener('mouseup', handleMouseUp);
      return () => {
        // @ts-ignore
        // eslint-disable-next-line react-hooks/exhaustive-deps
        messageRef.current?.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, []);

  const onExplanationClick = async (explanation: Explanation, element: any) => {
    if (window.getSelection) {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        const position = range.getBoundingClientRect();
        const messageRect = messageRef.current?.getBoundingClientRect();

        setTooltipPosition({
          // @ts-ignore
          bottom: messageRect.bottom - position.bottom,
          // @ts-ignore
          left: position.left - messageRect.left,
        });

        // @ts-ignore
        const selectedText = selection.toString();

        setSelectedText(selectedText);
        setTooltipVisible(!!selectedText);
        setExplanation(explanation);
      }
    }
  };

  function wrapTextInSpans(
    text: string,
    explanations: Explanation[]
  ): React.ReactNode[] {
    // Create an array of {index, explanation} objects
    let indices = [];
    for (let explanation of explanations) {
      let index = text.indexOf(explanation.textToExplain);
      while (index !== -1) {
        indices.push({ index: index, explanation: explanation });
        index = text.indexOf(explanation.textToExplain, index + 1);
      }
    }

    // Sort in descending order
    indices.sort((a, b) => b.index - a.index);

    // Insert <span> elements
    let components = [];
    let lastIndex = text.length;
    for (let { index, explanation } of indices) {
      let original = explanation.textToExplain;
      if (index + original.length < lastIndex) {
        components.unshift(text.slice(index + original.length, lastIndex));
        lastIndex = index + original.length;
      }
      components.unshift(
        <span
          key={index}
          className="underline cursor-pointer hover:text-blue-400"
          onClick={(e) => onExplanationClick(explanation, e.currentTarget)}
        >
          {original}
        </span>
      );
      lastIndex = index;
    }
    components.unshift(text.slice(0, lastIndex));

    return components;
  }

  const onEdit = async () => {
    setLoading(true);

    const response = await fetch('/api/messages/regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId: message.id }),
    });

    const newMessage = await response.json();

    onUpdateMessage(newMessage);

    setLoading(false);
  };

  return (
    <div
      key={message.id}
      ref={messageRef}
      className="relative flex items-start gap-2 text-left mb-2"
    >
      <ExplanationPopup
        show={tooltipVisible}
        text={selectedText}
        position={tooltipPosition}
        message={message}
        existingExplanation={explanation}
        conversation={conversation}
      />
      <img
        src={`/characters/${conversation.character?.slug}.png`}
        className="w-12 h-12 rounded-full"
        alt={conversation.character?.name}
      />
      <div>
        <div className="bg-gray-300 text-black inline-block rounded-md px-4 py-2 max-w-lg">
          <p className="text-gray-500 text-sm mb-1">
            {conversation.character?.name}
          </p>
          <p className="relative">
            {loading && (
              <LoadingSkeleton className="absolute w-full h-full left-0 top-0 bg-gray-300 pb-4 box-content" />
            )}
            {wrapTextInSpans(message.text, explanations)}
          </p>

          <p className="text-gray-500 text-xs text-right flex mt-2">
            {canBeEdited && (
              <span className="mr-2 cursor-pointer" onClick={onEdit}>
                I don't understand
              </span>
            )}
            <span className="justify-end ml-auto">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
