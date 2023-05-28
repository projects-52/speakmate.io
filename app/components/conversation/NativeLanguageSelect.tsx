import { useState } from 'react';
import { getAvailableNativeLanguages } from '~/services/language.service';
import { useTranslation } from 'react-i18next';
import type { Language } from '~/types/language.type';

interface NativeLanguageSelectProps {
  onChange: (language: Language) => void;
}

export function NativeLanguageSelect({ onChange }: NativeLanguageSelectProps) {
  const [languages] = useState<Language[]>(getAvailableNativeLanguages());
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>();

  const { t } = useTranslation();

  const onLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onChange(language);
  };

  return (
    <div className="mb-4">
      <h3 className="mb-4 mt-2">{t('language.native.title')}</h3>
      <div className="flex flex-wrap gap-2">
        {languages
          .filter((language: Language) => language.available)
          .map((language: Language) => (
            <span
              className={`py-2 px-4 flex gap-2 rounded-lg cursor-pointer ${
                selectedLanguage?.slug === language.slug
                  ? 'bg-light-accent-500 shadow-md text-slate-100'
                  : 'bg-light-shades-500 text-slate-500'
              }`}
              key={language.slug}
              onClick={() => onLanguageSelect(language)}
            >
              <span>{language.icon}</span>
              <span>{language.nativeName}</span>
            </span>
          ))}
      </div>
    </div>
  );
}
