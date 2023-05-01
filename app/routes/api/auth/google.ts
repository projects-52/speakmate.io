import type { ActionFunction } from '@remix-run/node';
import { SocialsProvider } from 'remix-auth-socials';
import { authenticator } from '~/services/auth.service';

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: '/app/dashboard',
    failureRedirect: '/auth',
  });
};
