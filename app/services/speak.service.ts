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
): Promise<Voice> => {
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

export async function speak(text: string, gender: string, language: string) {
  try {
    const voice = await pickVoice(gender, language);
    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    synth.speak(utterance);
  } catch (error) {
    console.error(error);
    return;
  }
}
