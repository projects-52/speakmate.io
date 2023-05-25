import type { Card } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticator } from '~/services/auth.service';
import { getAllCardsByUserId } from '~/services/card.service';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  const cards = await getAllCardsByUserId(user.id);
  return { user, cards };
};

export default function Cards() {
  const { t } = useTranslation();
  const { cards } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      {cards.map((card: Card) => (
        <div
          key={card.id}
          className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4"
        >
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
      ))}
    </div>
  );
}
