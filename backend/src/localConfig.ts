import fs from 'fs/promises';
import path from 'path';

const LOCAL_CONFIG_PATH = path.join(process.cwd(), 'local-config.json');

export interface LocalConfig {
  llmEndpoint: string;
  llmModel: string;
  llmKey: string;
  imageEndpoint: string;
  imageModel: string;
  imageKey: string;
}

const DEFAULT_LOCAL_CONFIG: LocalConfig = {
  llmEndpoint: '/api/anthropic/v1/messages',
  llmModel: 'qwen3-max-2026-01-23',
  llmKey: '',
  imageEndpoint: '/api/ark/images/generations',
  imageModel: 'doubao-seedream-4-0-250828',
  imageKey: '',
};

export async function getLocalConfig(): Promise<LocalConfig> {
  try {
    const content = await fs.readFile(LOCAL_CONFIG_PATH, 'utf-8');
    const data = JSON.parse(content);
    return {
      llmEndpoint: String(data.llmEndpoint ?? DEFAULT_LOCAL_CONFIG.llmEndpoint).trim(),
      llmModel: String(data.llmModel ?? DEFAULT_LOCAL_CONFIG.llmModel).trim(),
      llmKey: String(data.llmKey ?? DEFAULT_LOCAL_CONFIG.llmKey).trim(),
      imageEndpoint: String(data.imageEndpoint ?? DEFAULT_LOCAL_CONFIG.imageEndpoint).trim(),
      imageModel: String(data.imageModel ?? DEFAULT_LOCAL_CONFIG.imageModel).trim(),
      imageKey: String(data.imageKey ?? DEFAULT_LOCAL_CONFIG.imageKey).trim(),
    };
  } catch {
    return DEFAULT_LOCAL_CONFIG;
  }
}

export function getDefaultLocalConfig(): LocalConfig {
  return DEFAULT_LOCAL_CONFIG;
}
