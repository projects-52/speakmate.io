import type { Card } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { SpeakIcon } from '../ui/SpeakIcon';

interface CardProps {
  card: Card;
}

// I need to add speak functionality
// But I can't do it easily since I rely on the conversation to get the language, that should be used for speach synthesis
export function CardItem({ card }: CardProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="md:flex">
        <div className="p-8 w-full">
          <h2 className="mt-1 text-lg leading-tight font-medium text-black capitalize flex justify-between items-center w-full">
            {card.text}
            <SpeakIcon
              language={card.language}
              gender="male"
              text={card.text}
            />
          </h2>

          <p className="mt-2 text-gray-500">
            {/** @ts-ignore */}
            {card.explanation.translation}
          </p>

          <p className="mt-2 text-gray-500">
            {/** @ts-ignore */}
            {card.explanation.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
