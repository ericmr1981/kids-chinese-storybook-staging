import fs from 'fs/promises';
import path from 'path';
import { encrypt, decrypt } from './encryption.js';

const KEYS_FILE_PATH = path.join(process.cwd(), 'keys.enc');

export interface Settings {
  useMockLLM: boolean;
  llmEndpoint: string;
  llmKey: string;
  llmModel: string;
  useMockImage: boolean;
  imageEndpoint: string;
  imageKey: string;
  imageModel: string;
}

const DEFAULT_SETTINGS: Settings = {
  useMockLLM: true,
  llmEndpoint: '',
  llmKey: '',
  llmModel: '',
  useMockImage: true,
  imageEndpoint: '',
  imageKey: '',
  imageModel: '',
};

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  let existing: Partial<Settings> = {};
  try {
    const content = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    existing = JSON.parse(decrypt(content));
  } catch { /* 文件不存在或损坏，从空开始 */ }

  const updated = { ...existing, ...settings };
  await fs.writeFile(KEYS_FILE_PATH, encrypt(JSON.stringify(updated)), { mode: 0o600 });
}

export async function getSettings(): Promise<{ settings: Settings; hasSavedSettings: boolean }> {
  try {
    const content = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    const data = JSON.parse(decrypt(content));
    return {
      hasSavedSettings: true,
      settings: {
        useMockLLM: data.useMockLLM ?? DEFAULT_SETTINGS.useMockLLM,
        llmEndpoint: data.llmEndpoint ?? DEFAULT_SETTINGS.llmEndpoint,
        llmKey: data.llmKey ?? DEFAULT_SETTINGS.llmKey,
        llmModel: data.llmModel ?? DEFAULT_SETTINGS.llmModel,
        useMockImage: data.useMockImage ?? DEFAULT_SETTINGS.useMockImage,
        imageEndpoint: data.imageEndpoint ?? DEFAULT_SETTINGS.imageEndpoint,
        imageKey: data.imageKey ?? DEFAULT_SETTINGS.imageKey,
        imageModel: data.imageModel ?? DEFAULT_SETTINGS.imageModel,
      },
    };
  } catch {
    return {
      hasSavedSettings: false,
      settings: DEFAULT_SETTINGS,
    };
  }
}
