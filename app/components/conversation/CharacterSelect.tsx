import { useEffect, useState } from 'react';
import type { Character } from '~/types/character.type';
import { Characters } from '../../characters';

interface CharacterSelectProps {
  onChange: (slug: string) => void;
  language: string;
  nativeLanguage: string;
}

export function CharacterSelect({
  language,
  nativeLanguage,
  onChange,
}: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  const onSetCharacter = (slug: string) => {
    setSelectedCharacter(slug);
    onChange(slug);
  };

  if (!language) {
    return null;
  }

  const character = Characters[language].find(
    (c: Character) => c.slug === selectedCharacter
  );

  const languageToUse = nativeLanguage || language;

  return (
    <div className="p-8">
      {character && (
        <div className="flex mb-8 gap-8 items-center">
          <img
            src={`/characters/${character?.slug}.png`}
            alt={character?.name}
            className="w-72 h-72 rounded-full"
          />
          <div>
            <p className="text-2xl font-bold mb-4">{character?.name}</p>
            <p className="text-lg max-w-lg">
              {character?.welcome[languageToUse]}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {Characters[language]
          .filter((character) => character.slug !== selectedCharacter)
          .map((character: Character) => (
            <div
              key={character.slug}
              onClick={() => onSetCharacter(character.slug)}
              className="flex flex-col items-center justify-center p-4 cursor-pointer gap-4"
            >
              <img
                src={`/characters/${character.slug}.png`}
                alt={character.name}
                className="w-48 h-48 rounded-full"
              />
              <p className="text-lg">{character.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
