import crypto from 'crypto';

export function generateHash(text: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return hash.digest('hex');
}
