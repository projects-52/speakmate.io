import type { Character } from '~/types/character.type';
import { EnglishCharacters } from './english';
import { JapaneseCharacters } from './japanese';

export const Characters: Record<string, Character[]> = {
  'en-US': EnglishCharacters,
  'ja-JP': JapaneseCharacters,
};
