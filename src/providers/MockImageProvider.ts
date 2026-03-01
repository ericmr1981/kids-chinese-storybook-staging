import type { ImageProvider } from './ImageProvider';

/**
 * Mock Image Provider - 返回随机图片
 */
export class MockImageProvider implements ImageProvider {
  async generateImage(story: string): Promise<string> {
    // 使用故事的 hash 作为 seed
    const hash = this.hashCode(story);
    const seed = Math.abs(hash).toString();

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 使用 picsum.photos
    return `https://picsum.photos/seed/${seed}/400/300`;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}