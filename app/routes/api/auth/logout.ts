import type { ActionFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/' });
};
