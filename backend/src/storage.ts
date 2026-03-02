import fs from 'fs/promises';
import path from 'path';
import { encrypt, decrypt } from './encryption.js';

const KEYS_FILE_PATH = path.join(process.cwd(), 'keys.enc');

export async function saveSettings(settings: Record<string, string>): Promise<void> {
  let existing: Record<string, string> = {};
  try {
    const content = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    existing = JSON.parse(decrypt(content));
  } catch { /* 文件不存在或损坏，从空开始 */ }

  const updated = { ...existing, ...settings };
  await fs.writeFile(KEYS_FILE_PATH, encrypt(JSON.stringify(updated)), { mode: 0o600 });
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(KEYS_FILE_PATH, 'utf-8');
    return JSON.parse(decrypt(content));
  } catch {
    return { llmKey: '', imageKey: '' };
  }
}