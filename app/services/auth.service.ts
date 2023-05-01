import { GoogleStrategy } from 'remix-auth-socials';
import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/services/session.service';
import { findOrCreateAuthor } from './user.service';
import type { User } from '@prisma/client';

export const authenticator = new Authenticator<User>(sessionStorage);

async function handleSocialAuthCallback(res: { profile: any }) {
  const user = await findOrCreateAuthor({
    email: res.profile.emails[0].value,
    picture: res.profile.photos[0].value,
  });

  return user;
}

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ['openid', 'email', 'profile'],
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    handleSocialAuthCallback
  )
);
