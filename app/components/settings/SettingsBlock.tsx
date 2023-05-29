import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import type { User } from '@prisma/client';
import { Form } from '@remix-run/react';
import type { MutableRefObject } from 'react';
import { useState } from 'react';
import LanguagePopup from './LanguagesPopup';
import { useTranslation } from 'react-i18next';
import useClickOutside from '~/routes/app/hooks/useClickOutside';

interface SettingsBlockProps {
  user: User;
}

const languages: Record<string, { nativeName: string; icon: string }> = {
  en: { nativeName: 'English', icon: '🇺🇸' },
  ua: { nativeName: 'Українська', icon: '🇺🇦' },
};

export function SettingsBlock({ user }: SettingsBlockProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showLangiagePopup, setShowLanguagePopup] = useState(false);

  const { t } = useTranslation();

  const ref: MutableRefObject<HTMLDivElement | null> = useClickOutside(() =>
    setOpen(false)
  );

  return (
    <div
      className="mt-auto w-full relative cursor-pointer"
      onClick={() => setOpen((open) => !open)}
      ref={ref}
    >
      <div
        className={`w-full bg-light-shades-500 absolute left-0 z-0 transition-all duration-300 ${
          open ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex px-4 py-2 items-center gap-4 justify-center md:justify-normal">
          <img
            src={user.picture}
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-ellipsis overflow-hidden hidden md:block">
            {user.email}
          </span>
        </div>
        <div
          className="flex items-center gap-6 px-4 py-1 justify-center md:justify-normal"
          onClick={() => setShowLanguagePopup((show) => !show)}
        >
          <span className="w-10 h-10 p-1 text-4xl flex items-center justify-center">
            {languages[i18n.resolvedLanguage].icon}
          </span>
          <span className="hidden md:block">
            {' '}
            {languages[i18n.resolvedLanguage].nativeName}
          </span>
        </div>
        <Form method="post" action="/api/auth/logout">
          <button
            type="submit"
            className="flex items-center gap-6 px-4 py-1 justify-center md:justify-normal"
            tabIndex={-1}
          >
            <ArrowRightOnRectangleIcon className="w-10 h-10 p-1" />
            <span className="hidden md:block">{t('settings.logout')}</span>
          </button>
        </Form>
        <div className="flex items-center gap-6 px-4 py-1"></div>
      </div>
      <div className="flex items-center gap-4 z-10 relative bg-light-shades-500 p-3 py-6 justify-center md:justify-normal">
        <Cog6ToothIcon
          className={`w-10 h-10 transition duration-300 rounded-full p-1 hover:bg-light-shades-700 ${
            open
              ? 'rotate-180 bg-light-shades-900 hover:bg-light-shades-900'
              : ''
          }`}
        />
        <span className="hidden md:block">{t('settings.title')}</span>
      </div>
      <LanguagePopup
        open={showLangiagePopup}
        setOpen={() => setShowLanguagePopup((show) => !show)}
      />
    </div>
  );
}
