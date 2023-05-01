import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import i18n from '~/i18n/config';
import { i18nCookie } from '~/i18n/cookie';
// import { authenticator } from '~/services/auth.service';

export const action: ActionFunction = async ({ request }) => {
  // const author = await authenticator.isAuthenticated(request);

  // if (!author) {
  //   return null;
  // }

  const formData = await request.formData();
  const locale = formData.get('locale') || i18n.fallbackLng;

  return redirect('/app/settings', {
    headers: {
      'Set-Cookie': await i18nCookie.serialize(locale),
    },
  });
};
