import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import type { Character } from '@prisma/client';

interface CharactersFilterPopupProps {
  onClose: () => void;
  show: boolean;
  characters: Character[];
  onCharacterSelect: (character: Character | null) => void;
  selectedCharacter: Character | null;
}

export default function CharactersFilterPopup({
  onClose,
  show,
  characters,
  onCharacterSelect,
  selectedCharacter,
}: CharactersFilterPopupProps) {
  const { t } = useTranslation();

  const onCharacterClick = (character: Character | null) => {
    if (selectedCharacter?.slug === character?.slug) {
      return;
    }

    onCharacterSelect(character);
    onClose();
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-light-shades-500 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="py-2 px-4 flex-wrap flex">
                  <div
                    className={`flex flex-col items-center justify-center mr-2 cursor-pointer w-10 h-10 bg-light-shades-700 rounded-full border-2 flex-shrink-0 ${
                      selectedCharacter === null
                        ? 'border-dark-accent-500'
                        : 'border-light-shades-500'
                    }`}
                    onClick={() => onCharacterClick(null)}
                  >
                    {t('conversations.all')}
                  </div>
                  {characters.map((character) => (
                    <div
                      key={character.slug}
                      className="flex flex-col items-center justify-center flex-shrink-0 mb-2"
                      onClick={() => onCharacterClick(character)}
                    >
                      <img
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 cursor-pointer border-2  hover:border-dark-accent-500 ${
                          selectedCharacter?.slug === character.slug
                            ? 'border-dark-accent-500'
                            : 'border-light-shades-500'
                        }`}
                        src={`/characters/${character.slug}.png`}
                        alt={character.name}
                      />
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
