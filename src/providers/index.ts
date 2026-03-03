import type { LLMProvider } from './LLMProvider';
import { HttpLLMProvider } from './HttpLLMProvider';
import type { ImageProvider } from './ImageProvider';
import { HttpImageProvider } from './HttpImageProvider';

export * from './LLMProvider';
export * from './HttpLLMProvider';
export * from './ImageProvider';
export * from './HttpImageProvider';

export interface ProviderConfig {
  llmEndpoint: string;
  llmModel: string;
  imageEndpoint: string;
  imageModel: string;
}

export function createLLMProvider(config: ProviderConfig): LLMProvider {
  return new HttpLLMProvider(config.llmEndpoint, '', config.llmModel);
}

export function createImageProvider(config: ProviderConfig): ImageProvider {
  return new HttpImageProvider(config.imageEndpoint, '', config.imageModel);
}
