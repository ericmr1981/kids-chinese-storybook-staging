/**
 * LLM Provider Interface
 */
export interface LLMProvider {
  generateStory(keywords: string[], maxChars: number): Promise<string>;
}