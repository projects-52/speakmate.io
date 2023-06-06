import type { MutableRefObject } from 'react';
import useClickOutside from '~/routes/app/hooks/useClickOutside';
import { useTranslation } from 'react-i18next';

interface ExplanationTooltipProps {
  show: boolean;
  position: { bottom: number; left: number } | null;
  onButtonClick: () => void;
  onClose: () => void;
}

export default function ExplanationTooltip({
  show,
  position,
  onButtonClick,
  onClose,
}: ExplanationTooltipProps) {
  const ref: MutableRefObject<HTMLDivElement | null> = useClickOutside(() =>
    onClose()
  );

  const { t } = useTranslation();

  const style = position
    ? {
        bottom: `${position.bottom + 20}px`,
        left: `${position.left}px`,
      }
    : {};

  return show ? (
    <div
      className="absolute bg-white border p-1 rounded z-10"
      style={style}
      ref={ref}
    >
      <button
        data-button="card"
        onClick={onButtonClick}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        {t('conversation.explanationTooltip.button')}
      </button>
    </div>
  ) : null;
}
