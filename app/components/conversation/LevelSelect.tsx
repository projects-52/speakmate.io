import { useState } from 'react';
import { LanguageLevel } from '~/types/conversation.type';
import { useTranslation } from 'react-i18next';

interface LevelSelectProps {
  onChange: (level: string) => void;
}

export default function LevelSelect({ onChange }: LevelSelectProps) {
  const [level, setLevel] = useState<string>(LanguageLevel.Beginner.toString());

  const { t } = useTranslation();

  const onSetLevel = (level: string) => {
    setLevel(level);
    onChange(level);
  };

  return (
    <div className="mt-4">
      <h3 className="mb-4">{t('level.title')}</h3>
      <div className="flex flex-wrap gap-2">
        <div
          className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
            level === LanguageLevel.Beginner.toString()
              ? 'bg-primary-dark shadow-md'
              : 'bg-primary text-slate-500'
          }`}
          onClick={() => onSetLevel(LanguageLevel.Beginner.toString())}
        >
          {t('level.beginner')}
        </div>
        <div
          className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
            level === LanguageLevel.Intermediate.toString()
              ? 'bg-primary-dark shadow-md'
              : 'bg-primary text-slate-500'
          }`}
          onClick={() => onSetLevel(LanguageLevel.Intermediate.toString())}
        >
          {t('level.intermediate')}
        </div>
        <div
          className={`py-2 px-4 rounded-lg mb-2 cursor-pointer ${
            level === LanguageLevel.Advanced.toString()
              ? 'bg-primary-dark shadow-md'
              : 'bg-primary text-slate-500'
          }`}
          onClick={() => onSetLevel(LanguageLevel.Advanced.toString())}
        >
          {t('level.advanced')}
        </div>
      </div>
    </div>
  );
}
