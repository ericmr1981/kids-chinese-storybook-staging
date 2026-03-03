import type { LLMProvider } from './LLMProvider';
import { MockLLMProvider } from './MockLLMProvider';
import { HttpLLMProvider } from './HttpLLMProvider';
import type { ImageProvider } from './ImageProvider';
import { MockImageProvider } from './MockImageProvider';
import { HttpImageProvider } from './HttpImageProvider';

export * from './LLMProvider';
export * from './MockLLMProvider';
export * from './HttpLLMProvider';
export * from './ImageProvider';
export * from './MockImageProvider';
export * from './HttpImageProvider';

export interface ProviderConfig {
  useMockLLM: boolean;
  llmEndpoint: string;
  llmKey: string;
  llmModel: string;
  useMockImage: boolean;
  imageEndpoint: string;
  imageKey: string;
  imageModel: string;
}

/**
 * Provider Factory - 根据配置创建对应的 Provider 实例
 */
export function createLLMProvider(config: ProviderConfig): LLMProvider {
  if (config.useMockLLM) {
    return new MockLLMProvider();
  }
  return new HttpLLMProvider(config.llmEndpoint, config.llmKey, config.llmModel);
}

export function createImageProvider(config: ProviderConfig): ImageProvider {
  if (config.useMockImage) {
    return new MockImageProvider();
  }
  return new HttpImageProvider(config.imageEndpoint, config.imageKey, config.imageModel);
}