import type { LLMProvider } from './LLMProvider';

/**
 * Mock LLM Provider - 本地规则生成故事
 */
export class MockLLMProvider implements LLMProvider {
  private templates = [
    '从前，{keywords0}和{keywords1}是好朋友。他们住在美丽的森林里，每天一起玩耍。{keywords2}也加入了他们，他们度过了快乐的时光。',
    '有一天，{keywords0}遇到了困难。{keywords1}看到了，立刻来帮助。{keywords2}也伸出了援手，三个好朋友一起解决了问题。',
    '在遥远的宇宙中，{keywords0}和{keywords1}正在探险。突然，他们发现了神秘的{keywords2}。这是一个充满冒险的故事！',
    '{keywords0}喜欢看{keywords1}，{keywords2}也喜欢。他们约定一起去看，度过了一个美好的周末。',
  ];

  async generateStory(keywords: string[], maxChars: number): Promise<string> {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 使用关键词替换模板
    const template = this.templates[Math.floor(Math.random() * this.templates.length)];
    let story = template;

    for (let i = 0; i < 3; i++) {
      const keyword = keywords[i] || '朋友';
      story = story.replace(new RegExp(`\\{keywords${i}\\}`, 'g'), keyword);
    }

    // 添加更多关键词
    if (keywords.length > 3) {
      story += ' 故事中还有' + keywords.slice(3).join('、') + '。';
    }

    // 截断到最大字符数
    if (story.length > maxChars) {
      story = story.substring(0, maxChars);
      // 确保在中文边界截断
      story = story.substring(0, story.lastIndexOf('。') + 1);
    }

    return story;
  }
}