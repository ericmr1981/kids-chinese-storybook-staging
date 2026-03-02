import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  useMockLLM: boolean;
  llmEndpoint: string;
  llmKey: string;
  llmModel: string;
  useMockImage: boolean;
  imageEndpoint: string;
  imageKey: string;
  imageModel: string;

  setUseMockLLM: (useMock: boolean) => void;
  setLLMEndpoint: (endpoint: string) => void;
  setLLMKey: (key: string) => void;
  setLLMModel: (model: string) => void;
  setUseMockImage: (useMock: boolean) => void;
  setImageEndpoint: (endpoint: string) => void;
  setImageKey: (key: string) => void;
  setImageModel: (model: string) => void;

  loadSettingsFromServer: () => Promise<void>;
  saveSettingsToServer: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      useMockLLM: true,
      llmEndpoint: '/api/anthropic/v1/messages',
      llmKey: '',
      llmModel: 'qwen3-max-2026-01-23',
      useMockImage: true,
      imageEndpoint: '/api/ark/images/generations',
      imageKey: '',
      imageModel: 'doubao-seedream-4-0-250828',

      setUseMockLLM: (useMock) => set({ useMockLLM: useMock }),
      setLLMEndpoint: (endpoint) => set({ llmEndpoint: endpoint }),
      setLLMKey: (key) => set({ llmKey: key }),
      setLLMModel: (model) => set({ llmModel: model }),
      setUseMockImage: (useMock) => set({ useMockImage: useMock }),
      setImageEndpoint: (endpoint) => set({ imageEndpoint: endpoint }),
      setImageKey: (key) => set({ imageKey: key }),
      setImageModel: (model) => set({ imageModel: model }),

      loadSettingsFromServer: async () => {
        try {
          const res = await fetch('/api/settings', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (data.llmKey) set({ llmKey: data.llmKey });
            if (data.imageKey) set({ imageKey: data.imageKey });
          }
        } catch { /* 静默失败 */ }
      },

      saveSettingsToServer: async () => {
        const state = get();
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ llmKey: state.llmKey, imageKey: state.imageKey }),
        });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);