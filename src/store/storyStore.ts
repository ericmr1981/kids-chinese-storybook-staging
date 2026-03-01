import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Story {
  id: string;
  keywords: string[];
  content: string;
  imageUrl: string;
  createdAt: number;
}

export interface PartialStory {
  keywords: string[];
  content: string;
  imageUrl: string;
}

interface StoryStore {
  stories: Story[];
  addStory: (story: PartialStory) => void;
  deleteStory: (id: string) => void;
  clearStories: () => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set) => ({
      stories: [],
      addStory: (story) =>
        set((state) => ({
          stories: [
            ...state.stories,
            {
              ...story,
              id: Date.now().toString(),
              createdAt: Date.now(),
            },
          ],
        })),
      deleteStory: (id) =>
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== id),
        })),
      clearStories: () => set({ stories: [] }),
    }),
    {
      name: 'story-storage',
    }
  )
);