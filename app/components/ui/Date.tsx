import { isToday, isYesterday, format as formatFunc } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { enGB, uk, es, de, it, pl, pt, fr } from 'date-fns/locale';

const locales: Record<string, Locale> = {
  en: enGB,
  ua: uk,
  es: es,
  de: de,
  fr: fr,
  it: it,
  pl: pl,
  pt: pt,
};

interface DateComponentProps {
  date: Date;
  format?: string;
}

export function DateComponent({
  date,
  format = 'EEEE, MMMM do',
}: DateComponentProps) {
  const { t, i18n } = useTranslation();

  return (
    <span>
      {isToday(date) ? t('common.today') : ''}
      {isYesterday(date) ? t('common.yesterday') : ''}
      {!isToday(date) && !isYesterday(date)
        ? formatFunc(date, format, {
            locale: locales[i18n.language],
          })
        : ''}
    </span>
  );
}
