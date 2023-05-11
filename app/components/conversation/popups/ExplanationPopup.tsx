import type { Explanation, Message } from '@prisma/client';
import { useState } from 'react';
import { explainText } from '~/services/explanation.service';

interface ExplanationPopupProps {
  show: boolean;
  text: string;
  position: { bottom: number; left: number } | null;
  message: Message;
  existingExplanation?: Explanation;
}

export default function ExplanationPopup({
  show,
  position,
  text,
  message,
  existingExplanation,
}: ExplanationPopupProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<Explanation | undefined>(
    existingExplanation
  );
  const [addingToCards, setAddingToCards] = useState(false);

  const onButtonClick = async () => {
    setLoading(true);
    const explanation = await explainText(text, message);
    setLoading(false);
    setExplanation(explanation);
  };

  const onAddToCardsClick = async (e: React.MouseEvent) => {
    console.log('adding to cards');
    e.nativeEvent.stopPropagation();
    setAddingToCards(true);
    await fetch('/api/card/add', {
      method: 'POST',
      body: JSON.stringify({
        text,
        messageId: message.id,
      }),
    });

    setAddingToCards(false);
  };

  const style = position
    ? {
        bottom: `${position.bottom + 20}px`,
        left: `${position.left}px`,
      }
    : {};
  return show ? (
    <div className="absolute bg-white border p-4 rounded z-10" style={style}>
      {loading ? <p>Loading...</p> : null}
      {explanation && !loading && !existingExplanation ? (
        <div>
          <p>{explanation.explanation?.original}</p>
          <p>{explanation.explanation?.translation}</p>
          <p>{explanation.explanation?.explanation}</p>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={onAddToCardsClick}
          >
            {addingToCards ? 'Adding...' : 'Add to cards'}
          </button>
        </div>
      ) : null}
      {existingExplanation && !loading && !explanation ? (
        <div>
          <p>{existingExplanation.explanation?.original}</p>
          <p>{existingExplanation.explanation?.translation}</p>
          <p>{existingExplanation.explanation?.explanation}</p>
          <button
            data-button="card"
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={onAddToCardsClick}
          >
            {addingToCards ? 'Adding...' : 'Add to cards'}
          </button>
        </div>
      ) : null}
      {!explanation && !existingExplanation && !loading ? (
        <button
          data-button="card"
          onClick={onButtonClick}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          What is it?
        </button>
      ) : null}
    </div>
  ) : null;
}
