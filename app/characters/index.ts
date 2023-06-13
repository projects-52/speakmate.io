import type { Character } from '~/types/character.type';
import { EnglishCharacters } from './english';
import { FrenchCharacters } from './french';
import { GermanCharacters } from './german';
import { ItalianCharacters } from './italian';
import { JapaneseCharacters } from './japanese';
import { PolishCharacters } from './polish';
import { PortugueseCharacters } from './portuguese';
import { SpanishCharacters } from './spanish';

export const Characters: Record<string, Character[]> = {
  'en-US': EnglishCharacters,
  'ja-JP': JapaneseCharacters,
  'es-ES': SpanishCharacters,
  'de-DE': GermanCharacters,
  'fr-FR': FrenchCharacters,
  'it-IT': ItalianCharacters,
  'pl-PL': PolishCharacters,
  'pt-PT': PortugueseCharacters,
};
