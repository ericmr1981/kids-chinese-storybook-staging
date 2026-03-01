/**
 * Image Provider Interface
 */
export interface ImageProvider {
  generateImage(story: string): Promise<string>;
}