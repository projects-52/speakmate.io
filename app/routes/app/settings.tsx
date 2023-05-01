import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

const languages: Record<string, { nativeName: string }> = {
  en: { nativeName: 'English' },
  ua: { nativeName: 'Українська' },
};

export default function Settings() {
  const { i18n, t } = useTranslation();

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="font-semibold leading-6 text-gray-900 text-lg">
          Profile
        </h2>
        <img
          className="inline-block h-12 w-12 rounded-full mt-4"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <div className="mt-5">
          <Form method="post" action="/api/auth/logout">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {t('profile.logout')}
            </button>
          </Form>
        </div>

        <h2 className="font-semibold leading-6 text-gray-900 text-lg mt-8">
          {t('profile.language')}
        </h2>
        <div className="mt-4 flex gap-4">
          {Object.keys(languages).map((lng) => (
            <Form method="post" action="/api/settings/language" key={lng}>
              <input name="locale" type="hidden" value={lng} />
              {i18n.resolvedLanguage === lng ? (
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {languages[lng].nativeName}
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  {languages[lng].nativeName}
                </button>
              )}
            </Form>
          ))}
        </div>
      </div>
    </div>
  );
}
