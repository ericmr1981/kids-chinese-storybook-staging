import type { ImageProvider } from './ImageProvider';

/**
 * HTTP Image Provider - 调用 OpenAI-compatible Images API
 */
export class HttpImageProvider implements ImageProvider {
  private endpoint: string;
  private apiKey: string;
  private model: string;

  constructor(endpoint: string, apiKey: string, model: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateImage(story: string): Promise<string> {
    try {
      // 构建请求体（OpenAI Images API 格式）
      const requestBody = {
        model: this.model,
        prompt: story,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      };

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Image API error:', response.status, errorText);
        throw new Error(`图片生成失败 (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // 兼容多种响应格式
      let imageUrl = '';

      // OpenAI 格式: data.data[0].url
      if (data.data && Array.isArray(data.data) && data.data[0]?.url) {
        imageUrl = data.data[0].url;
      }
      // 自定义格式: data.imageUrl
      else if (data.imageUrl) {
        imageUrl = data.imageUrl;
      }
      else {
        console.error('Unexpected Image response:', data);
        throw new Error('无法解析 API 返回的图片 URL');
      }

      return imageUrl;
    } catch (error) {
      console.error('Image API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('图片生成失败，请检查设置');
    }
  }
}