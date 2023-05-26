import type { Card } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.service';
import { getAllCardsByUserId } from '~/services/card.service';
import { getAllConversationsForUser } from '~/services/conversation.service';
import { ConversationsList } from '~/components/conversation/ConversationsList';
import { CardItem } from '~/components/cards/Card';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  const cards = await getAllCardsByUserId(user.id);
  const conversations = await getAllConversationsForUser(user.id);
  return { user, cards, conversations };
};

export default function Cards() {
  const { conversations, user, cards } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full bg-primary">
      <ConversationsList conversations={conversations} user={user} />
      <div className="flex-1 relative overflow-y-auto">
        {cards.map((card: Card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
