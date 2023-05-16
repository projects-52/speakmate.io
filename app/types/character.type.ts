export type Character = {
  name: string;
  slug: string;
  language: string;
  gender: string;
  age: number;
  interests: string[];
  personality: string;
  welcome: Record<string, string>;
  visual: string;
};
