import type { Conversation, Explanation, Message } from '@prisma/client';
import React, { useState } from 'react';
import { explainText } from '~/services/explanation.service';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface ExplanationPopupProps {
  show: boolean;
  text: string;
  position: { bottom: number; left: number } | null;
  message: Message;
  existingExplanation?: Explanation;
  conversation: Conversation;
}

export default function ExplanationPopup({
  show,
  position,
  text,
  message,
  existingExplanation,
  conversation,
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

  const onSpeak = (e: React.MouseEvent) => {
    e.nativeEvent.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = conversation.language as string;
    window.speechSynthesis.speak(utterance);
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
          <p className="flex items-center gap-2">
            {/** @ts-ignore */}
            {explanation.explanation?.original}{' '}
            <SpeakerWaveIcon
              className="w-10 h-10 cursor-pointer hover:bg-slate-100 rounded p-2"
              onClick={onSpeak}
              data-button="card"
            />
          </p>
          {/** @ts-ignore */}
          <p>{explanation.explanation?.translation}</p>
          {/** @ts-ignore */}
          <p>{explanation.explanation?.explanation}</p>
          <button
            data-button="card"
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={onAddToCardsClick}
          >
            {addingToCards ? 'Adding...' : 'Add to cards'}
          </button>
        </div>
      ) : null}
      {existingExplanation && !loading && !explanation ? (
        <div>
          <p className="flex items-center gap-2">
            {/** @ts-ignore */}
            {existingExplanation.explanation?.original}{' '}
            <SpeakerWaveIcon
              className="w-10 h-10 cursor-pointer hover:bg-slate-100 rounded p-2"
              onClick={onSpeak}
              data-button="card"
            />
          </p>
          {/** @ts-ignore */}
          <p>{existingExplanation.explanation?.translation}</p>
          {/** @ts-ignore */}
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
