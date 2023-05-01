import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import i18next from './i18n/server';

import stylesheet from '~/tailwind.css';
import { i18nCookie } from './i18n/cookie';
import { useChangeLanguage } from './i18n/useChangeLanguage';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesheet }];
};

export async function loader({ request }: LoaderArgs) {
  const locale = await i18next.getLocale(request);
  const t = await i18next.getFixedT(request, 'common');
  const title = t('meta.title');
  return json(
    {
      locale,
      title,
    },
    {
      headers: { 'Set-Cookie': await i18nCookie.serialize(locale) },
    }
  );
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: 'common',
};

export const meta: MetaFunction = ({ data }) => ({
  charset: 'utf-8',
  title: data.title,
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  let { locale } = useLoaderData<typeof loader>();

  let { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} className="bg-primary h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
