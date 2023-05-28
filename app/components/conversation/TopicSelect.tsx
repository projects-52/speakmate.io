import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Topic } from '~/types/topic.type';

interface TopicSelectProps {
  onChange: (topic: Topic | null) => void;
}

export default function TopicSelect({ onChange }: TopicSelectProps) {
  const [selectedTopic, setTopic] = useState<Topic | null>(null);

  const onSetTopic = (topic: Topic | null) => {
    setTopic(topic);
    onChange(topic);
  };

  const { t } = useTranslation();

  const TOPICS: Topic[] = [
    { name: 'Literature', key: t('topic.literature') },
    { name: 'Hiking', key: t('topic.hiking') },
    { name: 'Photography', key: t('topic.photography') },
    { name: 'Cooking', key: t('topic.cooking') },
    { name: 'History', key: t('topic.history') },
    { name: 'Gardening', key: t('topic.gardening') },
    { name: 'Education', key: t('topic.education') },
    { name: 'Yoga', key: t('topic.yoga') },
    { name: 'Music', key: t('topic.music') },
    { name: 'Social Media', key: t('topic.socialMedia') },
    { name: 'Movies and TV Shows', key: t('topic.moviesAndTvShows') },
    { name: 'Video Games', key: t('topic.videoGames') },
    { name: 'Food and Cuisine', key: t('topic.foodAndCuisine') },
    { name: 'Travel', key: t('topic.travel') },
    { name: 'Technology', key: t('topic.technology') },
    { name: 'Career and Work', key: t('topic.careerAndWork') },
    { name: 'Art and Culture', key: t('topic.artAndCulture') },
    { name: 'Environment', key: t('topic.environment') },
    { name: 'Health and Wellness', key: t('topic.healthAndWellness') },
    { name: 'Hobbies', key: t('topic.hobbies') },
  ];

  return (
    <div className="mt-4">
      <h3 className="mb-4 mt-2">{t('topic.chooseTopic')}</h3>
      <div className="flex flex-wrap gap-2">
        <div
          key="No topic"
          className={`p-2 px-4 rounded-lg mb-2 cursor-pointer ${
            selectedTopic === null
              ? 'bg-light-accent-500 shadow-md text-slate-100'
              : 'bg-light-shades-500 text-slate-500'
          }`}
          onClick={() => onSetTopic(null)}
        >
          {t('topic.noTopic')}
        </div>
        {TOPICS.map((topic) => (
          <div
            key={topic.name}
            className={`p-2 px-4 rounded-lg mb-2 cursor-pointer ${
              topic.name === selectedTopic?.name
                ? 'bg-light-accent-500 shadow-md text-slate-100'
                : 'bg-light-shades-500 text-slate-500'
            }`}
            onClick={() => onSetTopic(topic)}
          >
            {topic.key}
          </div>
        ))}
      </div>
    </div>
  );
}
