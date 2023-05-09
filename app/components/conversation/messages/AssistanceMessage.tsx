import type { Explanation, Message } from '@prisma/client';
import { useState, useRef, useEffect } from 'react';
import ExplanationPopup from '../popups/ExplanationPopup';

interface AssistantMessageProps {
  message: Message;
  explanations: Explanation[];
}

export default function AssistantMessage({
  message,
  explanations,
}: AssistantMessageProps) {
  const [selectedText, setSelectedText] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    bottom: number;
    left: number;
  } | null>(null);
  const [explanation, setExplanation] = useState<Explanation>();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
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

  return (
    <div
      key={message.id}
      ref={messageRef}
      className={`relative ${
        message.role === 'user' ? 'text-right' : 'text-left'
      }`}
    >
      <ExplanationPopup
        show={tooltipVisible}
        text={selectedText}
        position={tooltipPosition}
        message={message}
        existingExplanation={explanation}
      />
      <div className="bg-gray-300 text-black inline-block rounded-md px-4 py-2 m-1 max-w-lg">
        {wrapTextInSpans(message.text, explanations)}
      </div>
    </div>
  );
}
