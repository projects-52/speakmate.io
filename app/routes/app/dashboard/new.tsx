import { Form, useTransition } from '@remix-run/react';
import { useState } from 'react';
import { CharacterSelect } from '~/components/conversation/CharacterSelect';
import LevelSelect from '~/components/conversation/LevelSelect';
import TopicSelect from '~/components/conversation/TopicSelect';
import { LanguageLevel } from '~/types/conversation.type';
import { useTranslation } from 'react-i18next';

import { LanguageForPracticeSelect } from '~/components/conversation/LanguageForPracticeSelect';
import { NativeLanguageSelect } from '~/components/conversation/NativeLanguageSelect';
import type { Language } from '~/types/language.type';
import type { Topic } from '~/types/topic.type';
import type { Character } from '~/types/character.type';

export default function NewConversation() {
  const [level, setLevel] = useState<string>(LanguageLevel.Beginner.toString());
  const [language, setLanguage] = useState<Language | null>(null);
  const [nativeLanguage, setNativeLanguage] = useState<Language | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);

  const { t } = useTranslation();

  const transition = useTransition();

  const disabled = !language || !nativeLanguage || !level || !character;

  if (transition.state === 'submitting') {
    return (
      <div className="h-screen bg-primary relative z-10 p-4 overflow-y-auto flex justify-center items-center">
        <div className="relative w-60 h-60">
          <div className="w-full h-full rounded-full border-4 border-l-blue-300 border-r-transparent border-t-transparent border-b-transparent absolute -top-1 -left-1 animate-spin box-content"></div>
          <img
            src={`/characters/${character?.slug}.png`}
            alt={character?.name}
            className="w-60 h-60 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-primary relative z-10 p-4 overflow-y-auto">
      <LanguageForPracticeSelect onChange={(value) => setLanguage(value)} />
      <NativeLanguageSelect onChange={(value) => setNativeLanguage(value)} />
      <LevelSelect onChange={(value) => setLevel(value)} />

      <TopicSelect onChange={(value) => setTopic(value)} />

      <CharacterSelect
        language={language}
        nativeLanguage={nativeLanguage}
        onChange={(value) => setCharacter(value)}
      />

      <Form method="post" action="/api/conversations/create">
        <input type="hidden" name="language" value={language?.slug} />
        <input type="hidden" name="native" value={nativeLanguage?.slug} />
        <input type="hidden" name="level" value={level} />
        <input type="hidden" name="topic" value={topic?.name} />
        <input type="hidden" name="character" value={character?.slug} />
        <button
          disabled={disabled}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-slate-300"
        >
          {t('conversation.start')}
        </button>
      </Form>
    </div>
  );
}
