import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import i18n from '~/i18n/config';
import { i18nCookie } from '~/i18n/cookie';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const locale = formData.get('locale') || i18n.fallbackLng;
  const redirectTo = (formData.get('redirectTo') as string) || '/app/dashboard';

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await i18nCookie.serialize(locale),
    },
  });
};
