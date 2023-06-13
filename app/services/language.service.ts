import type { Language } from '~/types/language.type';

export function getLanguagesAvailableForPractice(): Language[] {
  return [
    { nativeName: 'English', icon: '🇺🇸', slug: 'en-US', available: true },
    { nativeName: 'Українська', icon: '🇺🇦', slug: 'uk-UA', available: false },
    { nativeName: 'Español', icon: '🇪🇸', slug: 'es-ES', available: true },
    { nativeName: 'Français', icon: '🇫🇷', slug: 'fr-FR', available: true },
    { nativeName: 'Deutsch', icon: '🇩🇪', slug: 'de-DE', available: true },
    { nativeName: 'Italiano', icon: '🇮🇹', slug: 'it-IT', available: true },
    { nativeName: 'Português', icon: '🇵🇹', slug: 'pt-PT', available: true },
    { nativeName: '日本語', icon: '🇯🇵', slug: 'ja-JP', available: true },
    { nativeName: 'Nederlands', icon: '🇳🇱', slug: 'nl-NL', available: false },
    { nativeName: 'Polski', icon: '🇵🇱', slug: 'pl-PL', available: true },
  ];
}

export function getAvailableNativeLanguages(): Language[] {
  return [
    { nativeName: 'English', icon: '🇺🇸', slug: 'en-US', available: true },
    { nativeName: 'Українська', icon: '🇺🇦', slug: 'uk-UA', available: true },
    { nativeName: 'Español', icon: '🇪🇸', slug: 'es-ES', available: true },
    { nativeName: 'Français', icon: '🇫🇷', slug: 'fr-FR', available: true },
    { nativeName: 'Deutsch', icon: '🇩🇪', slug: 'de-DE', available: true },
    { nativeName: 'Italiano', icon: '🇮🇹', slug: 'it-IT', available: true },
    { nativeName: 'Português', icon: '🇵🇹', slug: 'pt-PT', available: true },
    { nativeName: '日本語', icon: '🇯🇵', slug: 'ja-JP', available: false },
    { nativeName: 'Nederlands', icon: '🇳🇱', slug: 'nl-NL', available: false },
  ];
}
