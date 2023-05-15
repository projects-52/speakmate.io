import { Form } from '@remix-run/react';
import { useState } from 'react';
import LanguageSelect from '~/components/conversation/LanguageSelect';
import LevelSelect from '~/components/conversation/LevelSelect';
import TopicSelect from '~/components/conversation/TopicSelect';
import { LanguageLevel } from '~/types/conversation.type';

export default function NewConversation() {
  const [level, setLevel] = useState<string>(LanguageLevel.Beginner.toString());
  const [language, setLanguage] = useState<string>('English');
  const [nativeLanguage, setNativeLanguage] = useState<string>('English');
  const [topic, setTopic] = useState<string>('');

  return (
    <div className="h-screen border-l border-slate-200 bg-white relative z-10 p-4">
      <LanguageSelect
        label="Choose language to practice"
        onChange={(value) => setLanguage(value)}
      />
      <LanguageSelect
        label="Choose your native language"
        onChange={(value) => setNativeLanguage(value)}
      />
      <LevelSelect onChange={(value) => setLevel(value)} />

      <TopicSelect onChange={(value) => setTopic(value)} />

      <Form method="post" action="/api/conversations/create">
        <input type="hidden" name="language" value={language} />
        <input type="hidden" name="native" value={nativeLanguage} />
        <input type="hidden" name="level" value={level} />
        <input type="hidden" name="topic" value={topic} />
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Start
        </button>
      </Form>
    </div>
  );
}
