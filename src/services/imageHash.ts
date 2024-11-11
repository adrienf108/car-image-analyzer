import { createHash } from 'crypto-browserify';

export const generateImageHash = async (base64: string): Promise<string> => {
  try {
    const hash = createHash('sha256');
    hash.update(base64);
    return hash.digest('hex');
  } catch (error) {
    console.error('Error generating image hash:', error);
    return Date.now().toString(); // Fallback to timestamp if hashing fails
  }
};