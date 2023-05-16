import { useState } from 'react';

interface TopicSelectProps {
  onChange: (level: string) => void;
}

const TOPICS = [
  'Literature',
  'Hiking',
  'Photography',
  'Cooking',
  'History',
  'Gardening',
  'Education',
  'Yoga',
  'Music',
  'Social Media',
  'Movies and TV Shows',
  'Video Games',
  'Food and Cuisine',
  'Travel',
  'Technology',
  'Career and Work',
  'Art and Culture',
  'Environment',
  'Health and Wellness',
  'Hobbies',
];

export default function TopicSelect({ onChange }: TopicSelectProps) {
  const [selectedTopic, setTopic] = useState<string>('');

  const onSetTopic = (topic: string) => {
    setTopic(topic);
    onChange(topic);
  };

  return (
    <div className="mt-4">
      <p className="block text-lg font-medium leading-6 text-gray-900 mb-2">
        Choose topic
      </p>
      <div className="flex flex-wrap gap-2">
        <div
          key="No topic"
          className={`border-2  p-2 rounded-lg mb-2 cursor-pointer ${
            selectedTopic === '' ? 'border-blue-500' : 'border-slate-300'
          }`}
          onClick={() => onSetTopic('')}
        >
          <p className="text-lg">No topic</p>
        </div>
        {TOPICS.map((topic) => (
          <div
            key={topic}
            className={`border-2  p-2 rounded-lg mb-2 cursor-pointer ${
              topic === selectedTopic ? 'border-blue-500' : 'border-slate-300'
            }`}
            onClick={() => onSetTopic(topic)}
          >
            <p className="text-lg">{topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
