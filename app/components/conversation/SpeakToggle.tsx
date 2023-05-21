import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

interface SpeakToggleProps {
  onChange: (value: boolean) => void;
  value: boolean;
}

export function SpeakToggle({ onChange, value }: SpeakToggleProps) {
  return value ? (
    <SpeakerWaveIcon
      className="w-10 h-10 ml-auto justify-self-end p-2 hover:bg-slate-300 hover:text-slate-50 cursor-pointer rounded-full"
      onClick={() => onChange(false)}
    />
  ) : (
    <SpeakerXMarkIcon
      className="w-10 h-10 ml-auto justify-self-end p-2 hover:bg-slate-300 hover:text-slate-50 cursor-pointer rounded-full"
      onClick={() => onChange(true)}
    />
  );
}
