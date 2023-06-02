import type { Conversation, Explanation, Message } from '@prisma/client';
import { useState, useRef, useEffect } from 'react';
import ExplanationTooltip from '../popups/ExplanationTooltip';
import { format } from 'date-fns';
import type { UIMessage } from '~/types/message.types';
import ExplanationPopup from '../popups/ExplanationPopup';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface AssistantMessageProps {
  message: UIMessage;
  conversation: Conversation;
  canBeEdited: boolean;
  onUpdateMessage: (message: UIMessage) => void;
}

export default function AssistantMessage({
  message,
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
  const [explanations, setExplanations] = useState<Explanation[]>(
    // @ts-ignore
    message.explanations as Explanation[]
  );
  const [loading, setLoading] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const [showExplanation, setShowExplanation] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
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

  const onShowExplanation = () => {
    setShowExplanation(true);
    setTooltipVisible(false);
  };

  const onExplanationClick = async (explanation: Explanation, element: any) => {
    setExplanation(explanation);
    setShowExplanation(true);
  };

  function wrapTextInSpans(
    text: string,
    explanations: Explanation[]
  ): React.ReactNode[] {
    // Deduplicate explanations
    const uniqueExplanations = explanations.filter(
      (explanation, index, self) =>
        self.findIndex((e) => e.id === explanation.id) === index
    );
    // Create an array of {index, explanation} objects
    let indices = [];
    for (let explanation of uniqueExplanations) {
      let original = explanation.textToExplain;
      if (original) {
        // ensure it's not an empty string
        let index = text.indexOf(original);
        while (index !== -1) {
          indices.push({ index: index, explanation: explanation });
          index = text.indexOf(original, index + original.length); // advance the index
        }
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
          className="underline cursor-pointer hover:text-blue-400 underline-offset-4 decoration-blue-400"
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

  const onAddExplanation = async (explanation: Explanation) => {
    setExplanations((explanations) => [...explanations, explanation]);
  };

  return (
    <div
      key={message.id}
      ref={messageRef}
      className="relative flex items-start gap-2 text-left mb-2"
    >
      <ExplanationTooltip
        show={tooltipVisible}
        position={tooltipPosition}
        onClose={() => setTooltipVisible(false)}
        onButtonClick={onShowExplanation}
      />
      {showExplanation && (
        <ExplanationPopup
          explanation={explanation}
          show={showExplanation}
          onClose={() => {
            setShowExplanation(false);
            setExplanation(undefined);
          }}
          conversation={conversation}
          text={selectedText}
          message={message as Message}
          onAddExplanation={onAddExplanation}
        />
      )}
      <img
        src={`/characters/${conversation.character?.slug}.png`}
        className="w-12 h-12 rounded-full"
        alt={conversation.character?.name}
      />
      <div>
        <div className="bg-gray-200 text-black inline-block rounded-md px-4 py-2 max-w-lg">
          <p className="text-gray-500 text-sm mb-1">
            {conversation.character?.name}
          </p>
          <p className="relative whitespace-pre-line">
            {loading && (
              <div className="absolute w-full h-full bg-gray-200 box-content pb-6 flex items-center justify-center text-slate-500 top-0 left-0">
                <ArrowPathIcon className="w-12 h-12 p-2 rotate" />
              </div>
            )}
            {/** @ts-ignore */}
            {wrapTextInSpans(message.text, explanations)}
          </p>

          <p className="text-gray-500 text-xs text-right flex mt-2">
            {canBeEdited && (
              <span className="mr-2 cursor-pointer" onClick={onEdit}>
                {t('message.dontUnderstand')}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
