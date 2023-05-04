import type { Message } from '@prisma/client';
import { useState, useRef, useEffect } from 'react';

interface AssistantMessageProps {
  message: Message;
}

interface TooltipProps {
  show: boolean;
  text: string;
  explanation: string | null;
  position: { bottom: number; left: number } | null;
  onButtonClick: () => void;
  loading: boolean;
}

function Tooltip({
  show,
  explanation,
  position,
  onButtonClick,
  loading,
}: TooltipProps) {
  const style = position
    ? {
        bottom: `${position.bottom + 20}px`,
        left: `${position.left}px`,
      }
    : {};
  return show ? (
    <div className="absolute bg-white border p-2 rounded z-10" style={style}>
      {loading ? <p>Loading...</p> : null}
      {explanation && !loading ? (
        <p dangerouslySetInnerHTML={{ __html: explanation }} />
      ) : null}
      {!explanation && !loading ? (
        <button
          onClick={onButtonClick}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          What is it?
        </button>
      ) : null}
    </div>
  ) : null;
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const [selectedText, setSelectedText] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    bottom: number;
    left: number;
  } | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      // @ts-ignore
      const selectedText = selection.toString();

      setSelectedText(selectedText);
      setTooltipVisible(!!selectedText);
      setExplanation(null);

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
        messageRef.current.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, []);

  const handleButtonClick = async () => {
    setLoading(true);
    const response = await fetch('/api/ai/explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: selectedText, messageId: message.id }),
    });
    setLoading(false);

    const explanation = await response.json();

    setExplanation(explanation);
  };

  return (
    <div
      key={message.id}
      ref={messageRef}
      className={`relative ${
        message.role === 'user' ? 'text-right' : 'text-left'
      }`}
    >
      <Tooltip
        show={tooltipVisible}
        text={selectedText}
        position={tooltipPosition}
        onButtonClick={handleButtonClick}
        explanation={explanation}
        loading={loading}
      />
      <div className="bg-gray-300 text-black inline-block rounded-md px-4 py-2 m-1 max-w-lg">
        {message.text}
      </div>
    </div>
  );
}
