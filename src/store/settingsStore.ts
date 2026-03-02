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
    (set, get) => {
      // 自动保存到服务器的辅助函数
      const autoSave = async () => {
        const state = get();
        try {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              useMockLLM: state.useMockLLM,
              llmEndpoint: state.llmEndpoint,
              llmKey: state.llmKey,
              llmModel: state.llmModel,
              useMockImage: state.useMockImage,
              imageEndpoint: state.imageEndpoint,
              imageKey: state.imageKey,
              imageModel: state.imageModel,
            }),
          });
        } catch { /* 静默失败 */ }
      };

      return {
        useMockLLM: true,
        llmEndpoint: '/api/anthropic/v1/messages',
        llmKey: '',
        llmModel: 'qwen3-max-2026-01-23',
        useMockImage: true,
        imageEndpoint: '/api/ark/images/generations',
        imageKey: '',
        imageModel: 'doubao-seedream-4-0-250828',

        setUseMockLLM: (useMock) => {
          set({ useMockLLM: useMock });
          autoSave();
        },
        setLLMEndpoint: (endpoint) => {
          set({ llmEndpoint: endpoint });
          autoSave();
        },
        setLLMKey: (key) => {
          set({ llmKey: key });
          autoSave();
        },
        setLLMModel: (model) => {
          set({ llmModel: model });
          autoSave();
        },
        setUseMockImage: (useMock) => {
          set({ useMockImage: useMock });
          autoSave();
        },
        setImageEndpoint: (endpoint) => {
          set({ imageEndpoint: endpoint });
          autoSave();
        },
        setImageKey: (key) => {
          set({ imageKey: key });
          autoSave();
        },
        setImageModel: (model) => {
          set({ imageModel: model });
          autoSave();
        },

        loadSettingsFromServer: async () => {
          try {
            const res = await fetch('/api/settings', { credentials: 'include' });
            if (res.ok) {
              const data = await res.json();
              // 加载所有设置，如果服务器有值则覆盖本地默认值
              if (data.useMockLLM !== undefined) set({ useMockLLM: data.useMockLLM });
              if (data.llmEndpoint) set({ llmEndpoint: data.llmEndpoint });
              if (data.llmKey) set({ llmKey: data.llmKey });
              if (data.llmModel) set({ llmModel: data.llmModel });
              if (data.useMockImage !== undefined) set({ useMockImage: data.useMockImage });
              if (data.imageEndpoint) set({ imageEndpoint: data.imageEndpoint });
              if (data.imageKey) set({ imageKey: data.imageKey });
              if (data.imageModel) set({ imageModel: data.imageModel });
            }
          } catch { /* 静默失败 */ }
        },

        saveSettingsToServer: autoSave,
      };
    },
    {
      name: 'settings-storage',
    }
  )
);