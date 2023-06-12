import type { LoaderFunction } from '@remix-run/node';
import { AuthorizationError } from 'remix-auth';
import { SocialsProvider } from 'remix-auth-socials';
import { authenticator } from '~/services/auth.service';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
      successRedirect: '/app/dashboard',
      failureRedirect: '/auth',
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    if (error instanceof AuthorizationError) {
      console.error(error);
      return error;
    }
  }
};
