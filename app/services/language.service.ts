import type { Language } from '~/types/language.type';

export function getLanguagesAvailableForPractice(): Language[] {
  return [
    { nativeName: 'English', icon: '🇺🇸', slug: 'en-US', available: true },
    { nativeName: 'Українська', icon: '🇺🇦', slug: 'uk-UA', available: false },
    { nativeName: 'Español', icon: '🇪🇸', slug: 'es-ES', available: false },
    { nativeName: 'Français', icon: '🇫🇷', slug: 'fr-FR', available: false },
    { nativeName: 'Deutsch', icon: '🇩🇪', slug: 'de-DE', available: false },
    { nativeName: 'Italiano', icon: '🇮🇹', slug: 'it-IT', available: false },
    { nativeName: 'Português', icon: '🇵🇹', slug: 'pt-PT', available: false },
    { nativeName: '日本語', icon: '🇯🇵', slug: 'ja-JP', available: true },
    { nativeName: 'Nederlands', icon: '🇳🇱', slug: 'nl-NL', available: false },
  ];
}

export function getAvailableNativeLanguages(): Language[] {
  return [
    { nativeName: 'English', icon: '🇺🇸', slug: 'en-US', available: true },
    { nativeName: 'Українська', icon: '🇺🇦', slug: 'uk-UA', available: true },
    { nativeName: 'Español', icon: '🇪🇸', slug: 'es-ES', available: false },
    { nativeName: 'Français', icon: '🇫🇷', slug: 'fr-FR', available: false },
    { nativeName: 'Deutsch', icon: '🇩🇪', slug: 'de-DE', available: false },
    { nativeName: 'Italiano', icon: '🇮🇹', slug: 'it-IT', available: false },
    { nativeName: 'Português', icon: '🇵🇹', slug: 'pt-PT', available: false },
    { nativeName: '日本語', icon: '🇯🇵', slug: 'ja-JP', available: false },
    { nativeName: 'Nederlands', icon: '🇳🇱', slug: 'nl-NL', available: false },
  ];
}
