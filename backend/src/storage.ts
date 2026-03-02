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

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  let existing: Partial<Settings> = {};
  try {
    const content = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    existing = JSON.parse(decrypt(content));
  } catch { /* 文件不存在或损坏，从空开始 */ }

  const updated = { ...existing, ...settings };
  await fs.writeFile(KEYS_FILE_PATH, encrypt(JSON.stringify(updated)), { mode: 0o600 });
}

export async function getSettings(): Promise<Settings> {
  try {
    const content = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    const data = JSON.parse(decrypt(content));
    return {
      useMockLLM: data.useMockLLM ?? true,
      llmEndpoint: data.llmEndpoint ?? '',
      llmKey: data.llmKey ?? '',
      llmModel: data.llmModel ?? '',
      useMockImage: data.useMockImage ?? true,
      imageEndpoint: data.imageEndpoint ?? '',
      imageKey: data.imageKey ?? '',
      imageModel: data.imageModel ?? '',
    };
  } catch {
    return {
      useMockLLM: true,
      llmEndpoint: '',
      llmKey: '',
      llmModel: '',
      useMockImage: true,
      imageEndpoint: '',
      imageKey: '',
      imageModel: '',
    };
  }
}