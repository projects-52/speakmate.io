import type { Conversation } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

type Voice = SpeechSynthesisVoice & { lang: string; gender: string };

// A list of some commonly observed female voices.
const femaleVoices = [
  'Google UK English Female',
  'Microsoft Zira Desktop - English (United States)',
  'Microsoft Hazel Desktop - English (Great Britain)',
  'Alice',
  'Amelie',
  'Anna',
  'Carmit',
  'Damayanti',
  'Ellen',
  'Fiona',
  'Ioana',
  'Joana',
  'Kanya',
  'Karen',
  'Kyoko',
  'Laura',
  'Lekha',
  'Luciana',
  'Mariska',
  'Mei-Jia',
  'Melina',
  'Milena',
  'Moira',
  'Monica',
  'Nora',
  'Paulina',
  'Samantha',
  'Sara',
  'Satu',
  'Sin-ji',
  'Tessa',
  'Ting-Ting',
  'Veena',
  'Victoria',
  'Yelda',
  'Yuna',
  'Zosia',
  'Zuzana',
];

// A list of some commonly observed male voices.
const maleVoices = [
  'Google UK English Male',
  'Microsoft David Desktop - English (United States)',
  'Alex',
  'Daniel',
  'Diego',
  'Fred',
  'Luca',
  'Maged',
  'Thomas',
  'Xander',
  'Google 日本語',
];

const pickVoice = (
  gender: string,
  language: string,
  timeout: number = 5000
): Promise<Voice | null> => {
  if (!language || !gender) {
    throw new Error('Not enough data to pick a voice.');
  }

  const synth = window.speechSynthesis;

  return new Promise((resolve, reject) => {
    let voices: Voice[] = [];
    let start = Date.now();

    const attemptPick = () => {
      voices = synth.getVoices() as Voice[];

      if (voices.length === 0) {
        if (Date.now() - start > timeout) {
          reject(new Error('Timed out waiting for voices to load.'));
        } else {
          // If voices are not ready yet, try again in 100ms
          setTimeout(attemptPick, 100);
        }
      } else {
        const voicesList = gender === 'male' ? maleVoices : femaleVoices;

        let selectedVoice = voices.find(
          (voice) =>
            voice.lang.startsWith(language) && voicesList.includes(voice.name)
        );

        if (!selectedVoice) {
          reject(
            new Error(
              `No voice found for language: ${language} and gender: ${gender}`
            )
          );
        } else {
          resolve(selectedVoice);
        }
      }
    };

    attemptPick();
  });
};

export function useSpeak(conversation: Conversation, enabled: boolean) {
  const [voice, setVoice] = useState<Voice | null>(null);
  const synth = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synth.current = window.speechSynthesis;
    return () => {
      synth.current = null;
    };
  }, [conversation]);

  const onPickVoice = async (language: string, gender: string) => {
    if (voice) {
      return voice;
    }

    try {
      const newVoice = await pickVoice(language, gender);
      setVoice(newVoice);
      return newVoice;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const speak = async (text: string) => {
    if (!enabled) {
      return;
    }

    const voice = await onPickVoice(
      conversation.character?.gender as string,
      conversation.language as string
    );

    if (voice === null) {
      return;
    }

    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    synth.current?.speak(utterance);
  };

  const cancel = () => {
    synth.current?.cancel();
  };

  return { speak, cancel };
}
