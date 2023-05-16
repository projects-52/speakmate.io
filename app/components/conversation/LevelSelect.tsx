import { useState } from 'react';
import { LanguageLevel } from '~/types/conversation.type';

interface LevelSelectProps {
  onChange: (level: string) => void;
}

export default function LevelSelect({ onChange }: LevelSelectProps) {
  const [level, setLevel] = useState<string>(LanguageLevel.Beginner.toString());

  const onSetLevel = (level: string) => {
    console.log(level === LanguageLevel.Beginner.toString());
    setLevel(level);
    onChange(level);
  };

  return (
    <div className="mt-4">
      <p className="block text-lg font-medium leading-6 text-gray-900 mb-2">
        Choose level
      </p>
      <div className="flex flex-wrap gap-2">
        <div
          className={`border-2  p-2 rounded-lg mb-2 cursor-pointer ${
            level === LanguageLevel.Beginner.toString()
              ? 'border-blue-500'
              : 'border-slate-300'
          }`}
          onClick={() => onSetLevel(LanguageLevel.Beginner.toString())}
        >
          <p className="text-lg">Begginer</p>
        </div>
        <div
          className={`border-2  p-2 rounded-lg mb-2 cursor-pointer ${
            level === LanguageLevel.Intermediate.toString()
              ? 'border-blue-500'
              : 'border-slate-300'
          }`}
          onClick={() => onSetLevel(LanguageLevel.Intermediate.toString())}
        >
          <p className="text-lg">Intermediate</p>
        </div>
        <div
          className={`border-2  p-2 rounded-lg mb-2 cursor-pointer ${
            level === LanguageLevel.Advanced.toString()
              ? 'border-blue-500'
              : 'border-slate-300'
          }`}
          onClick={() => onSetLevel(LanguageLevel.Advanced.toString())}
        >
          <p className="text-lg">Advanced</p>
        </div>
      </div>
    </div>
  );
}
