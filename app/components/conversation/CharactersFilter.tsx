import type { Character, Conversation } from '@prisma/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CharactersFilterPopup from './popups/CharactersFilterPopup';

interface CharactersFilterProps {
  conversations: Conversation[];
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character | null) => void;
}

type UniqueCharacters = {
  [key: string]: Character;
};

function getUniqueCharacters(conversations: Conversation[]): Character[] {
  const uniqueCharacters: UniqueCharacters = conversations.reduce(
    (acc: UniqueCharacters, conversation) => {
      if (conversation.character && !acc[conversation.character.slug]) {
        acc[conversation.character.slug] = conversation.character;
      }
      return acc;
    },
    {}
  );

  const result: Character[] = Object.values(uniqueCharacters);

  return result;
}

export function CharactersFilter({
  selectedCharacter,
  onCharacterSelect,
  conversations,
}: CharactersFilterProps) {
  const [showPopup, setShowPopup] = useState(false);

  const { t } = useTranslation();

  const uniqueCharacters = getUniqueCharacters(conversations);

  return uniqueCharacters.length > 1 ? (
    <React.Fragment>
      <div className="py-2 px-4 flex-wrap hidden md:flex">
        <div
          className={`flex flex-col items-center justify-center mr-2 cursor-pointer w-10 h-10 bg-light-shades-700 rounded-full border-2 flex-shrink-0 ${
            selectedCharacter === null ? 'border-dark-accent-500' : ''
          }`}
          onClick={() => onCharacterSelect(null)}
        >
          {t('conversations.all')}
        </div>
        {uniqueCharacters.map((character) => (
          <div
            key={character.slug}
            className="flex flex-col items-center justify-center flex-shrink-0 mb-2"
            onClick={() => onCharacterSelect(character)}
          >
            <img
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 cursor-pointer border-2 border-light-shades-500 hover:border-dark-accent-500 ${
                selectedCharacter?.slug === character.slug
                  ? 'border-dark-accent-500'
                  : ''
              }`}
              src={`/characters/${character.slug}.png`}
              alt={character.name}
            />
          </div>
        ))}
      </div>
      <div className="md:hidden flex justify-center border-b border-slate-300 m-4 mb-2 pb-4">
        {selectedCharacter ? (
          <div
            key={selectedCharacter.slug}
            className="flex flex-col items-center justify-center flex-shrink-0 mb-2"
            onClick={() => setShowPopup(true)}
          >
            <img
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2  hover:border-dark-accent-500 border-dark-accent-500`}
              src={`/characters/${selectedCharacter.slug}.png`}
              alt={selectedCharacter.name}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center cursor-pointer w-10 h-10 bg-light-shades-700 rounded-full border-2 flex-shrink-0 border-dark-accent-500`}
            onClick={() => setShowPopup(true)}
          >
            {t('conversations.all')}
          </div>
        )}
        {showPopup && (
          <CharactersFilterPopup
            characters={uniqueCharacters}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={onCharacterSelect}
            onClose={() => setShowPopup(false)}
            show={showPopup}
          />
        )}
      </div>
    </React.Fragment>
  ) : null;
}
