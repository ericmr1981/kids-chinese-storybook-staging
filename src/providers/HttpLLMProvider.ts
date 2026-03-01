import type { LLMProvider } from './LLMProvider';

/**
 * HTTP LLM Provider - 调用 Anthropic-compatible Messages API
 */
export class HttpLLMProvider implements LLMProvider {
  private endpoint: string;
  private apiKey: string;
  private model: string;

  constructor(endpoint: string, apiKey: string, model: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateStory(keywords: string[], maxChars: number): Promise<string> {
    try {
      const keywordsText = keywords.join('、');

      // 构建用户消息
      const userMessage = `请写一个适合儿童的中文小故事。
要求：
1. 故事中要包含以下关键词：${keywordsText}
2. 故事长度不超过 ${maxChars} 个中文字符
3. 语言生动有趣，适合儿童理解
4. 只返回故事内容，不要其他说明`;

      // 构建请求体（Anthropic Messages API 格式）
      const requestBody = {
        model: this.model,
        max_tokens: maxChars * 2, // 预留一些 token 空间
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      };

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LLM API error:', response.status, errorText);
        throw new Error(`故事生成失败 (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // 兼容多种响应格式
      let story = '';

      // Anthropic 格式: data.content[0].text
      if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
        story = data.content[0].text;
      }
      // 简化格式: data.content
      else if (data.content && typeof data.content === 'string') {
        story = data.content;
      }
      // 自定义格式: data.story
      else if (data.story) {
        story = data.story;
      }
      // OpenAI 格式: data.choices[0].message.content
      else if (data.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) {
        story = data.choices[0].message.content;
      }
      else {
        console.error('Unexpected LLM response:', data);
        throw new Error('无法解析 API 返回的故事内容');
      }

      // 清理故事内容（移除可能的标记）
      story = story.trim();

      // 确保不超过最大字符数
      if (story.length > maxChars) {
        story = story.substring(0, maxChars);
        // 确保在中文边界截断
        story = story.substring(0, story.lastIndexOf('。') + 1);
      }

      return story;
    } catch (error) {
      console.error('LLM API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('故事生成失败，请检查设置');
    }
  }
}