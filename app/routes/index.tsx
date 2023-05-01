import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

const languages: Record<string, { nativeName: string }> = {
  en: { nativeName: 'English' },
  ua: { nativeName: 'Українська' },
};

export default function Index() {
  const { i18n, t } = useTranslation();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1 className="text-3xl font-bold underline">{t('hello.world')}</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>

      {Object.keys(languages).map((lng) => (
        <Form method="post" action="/api/settings/language" key={lng}>
          <input name="locale" type="hidden" value={lng} />
          <button
            className={classnames({
              active: i18n.resolvedLanguage === lng,
            })}
          >
            {languages[lng].nativeName}
          </button>
        </Form>
      ))}
    </div>
  );
}
