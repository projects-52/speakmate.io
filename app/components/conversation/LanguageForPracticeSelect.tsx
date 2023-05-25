import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguagesAvailableForPractice } from '~/services/language.service';
import type { Language } from '~/types/language.type';

interface LanguageForPracticeSelectProps {
  onChange: (language: Language) => void;
}

export function LanguageForPracticeSelect({
  onChange,
}: LanguageForPracticeSelectProps) {
  const [languages] = useState<Language[]>(getLanguagesAvailableForPractice());
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>();

  const { t } = useTranslation();

  const onLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    onChange(language);
  };

  return (
    <div className="mb-8">
      <h3 className="mb-4 mt-2">{t('language.practice.title')}</h3>
      <div className="flex flex-wrap gap-2">
        {languages
          .filter((language: Language) => language.available)
          .map((language: Language) => (
            <span
              className={`py-2 px-4 flex gap-2 rounded-lg cursor-pointer ${
                selectedLanguage?.slug === language.slug
                  ? 'bg-primary-dark shadow-md'
                  : 'bg-primary text-slate-500'
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
