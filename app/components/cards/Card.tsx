import type { Card } from '@prisma/client';
import { useTranslation } from 'react-i18next';

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
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {t('card.word')}
          </div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black capitalize">
            {card.text}
          </h2>
          <div className="uppercase tracking-wide text-sm text-green-500 font-semibold mt-4">
            {t('card.translation')}
          </div>
          <p className="mt-2 text-gray-500">
            {/** @ts-ignore */}
            {card.explanation.translation}
          </p>
          <div className="uppercase tracking-wide text-sm text-red-500 font-semibold mt-4">
            {t('card.explanation')}
          </div>
          <p className="mt-2 text-gray-500">
            {/** @ts-ignore */}
            {card.explanation.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
