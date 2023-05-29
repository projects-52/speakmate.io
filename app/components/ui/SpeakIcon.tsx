import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { useSpeak } from '~/routes/app/hooks/useSpeak';

interface SpeakIconProps {
  language: string;
  gender: string;
  text: string;
  enabled?: boolean;
}

export function SpeakIcon({
  language,
  gender,
  text,
  enabled = true,
}: SpeakIconProps) {
  const { speak, speaking, isAvailable } = useSpeak(language, gender, enabled);

  const onSpeak = () => {
    speak(text);
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <div className="relative w-10 h-10 rounded-full text-slate-500">
      {speaking && (
        <div className="w-full h-full rounded-full bg-blue-300 absolute top-0 left-0 animate-ping"></div>
      )}
      <SpeakerWaveIcon
        onClick={onSpeak}
        className="w-10 h-10 p-2 hover:bg-blue-300 hover:text-slate-50 cursor-pointer rounded-full relative z-10"
      />
    </div>
  );
}
