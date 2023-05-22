import useClickOutside from '~/routes/app/hooks/useClickOutside';

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
  useClickOutside(() => onClose());

  const style = position
    ? {
        bottom: `${position.bottom + 20}px`,
        left: `${position.left}px`,
      }
    : {};

  return show ? (
    <div className="absolute bg-white border p-4 rounded z-10" style={style}>
      <button
        data-button="card"
        onClick={onButtonClick}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        What is it?
      </button>
    </div>
  ) : null;
}
