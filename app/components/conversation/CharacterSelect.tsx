import { useState } from 'react';
import type { Character } from '~/types/character.type';
import type { Language } from '~/types/language.type';
import { Characters } from '../../characters';

interface CharacterSelectProps {
  onChange: (character: Character) => void;
  language: Language | null;
  nativeLanguage: Language | null;
}

export function CharacterSelect({
  language,
  nativeLanguage,
  onChange,
}: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const onSetCharacter = (character: Character) => {
    setSelectedCharacter(character);
    onChange(character);
  };

  if (!language) {
    return null;
  }

  const character = Characters[language.slug].find(
    (c: Character) => c.slug === selectedCharacter?.slug
  );

  const languageToUse = nativeLanguage?.slug || language?.slug;

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
        {Characters[language.slug]
          .filter((character) => character.slug !== selectedCharacter?.slug)
          .map((character: Character) => (
            <div
              key={character.slug}
              onClick={() => onSetCharacter(character)}
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
