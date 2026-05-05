import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

function getEnv(key: string, required = false): string | undefined {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  ghl: {
    apiToken: getEnv('GHL_API_TOKEN'),
    clientId: getEnv('GHL_CLIENT_ID'),
    clientSecret: getEnv('GHL_CLIENT_SECRET'),
    refreshToken: getEnv('GHL_REFRESH_TOKEN'),
    accessToken: getEnv('GHL_ACCESS_TOKEN'),
    locationId: getEnv('GHL_LOCATION_ID', true)!,
    apiBase: getEnv('GHL_API_BASE') || 'https://services.leadconnectorhq.com',
    apiVersion: getEnv('GHL_API_VERSION') || '2021-07-28',
  },
};
