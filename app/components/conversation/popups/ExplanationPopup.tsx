import type { Explanation, Message } from '@prisma/client';
import { useEffect, useState } from 'react';
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

  const onButtonClick = async () => {
    setLoading(true);
    const explanation = await explainText(text, message);
    setLoading(false);
    setExplanation(explanation);
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
        </div>
      ) : null}
      {existingExplanation && !loading && !explanation ? (
        <div>
          <p>{existingExplanation.explanation?.original}</p>
          <p>{existingExplanation.explanation?.translation}</p>
          <p>{existingExplanation.explanation?.explanation}</p>
        </div>
      ) : null}
      {!explanation && !existingExplanation && !loading ? (
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
