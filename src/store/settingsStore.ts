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
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;

  setUseMockLLM: (useMock: boolean) => void;
  setLLMEndpoint: (endpoint: string) => void;
  setLLMKey: (key: string) => void;
  setLLMModel: (model: string) => void;
  setUseMockImage: (useMock: boolean) => void;
  setImageEndpoint: (endpoint: string) => void;
  setImageKey: (key: string) => void;
  setImageModel: (model: string) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;

  loadSettingsFromServer: () => Promise<void>;
  saveSettingsToServer: () => Promise<void>;
}

const DEFAULT_SETTINGS = {
  useMockLLM: true,
  llmEndpoint: '/api/anthropic/v1/messages',
  llmKey: '',
  llmModel: 'qwen3-max-2026-01-23',
  useMockImage: true,
  imageEndpoint: '/api/ark/images/generations',
  imageKey: '',
  imageModel: 'doubao-seedream-4-0-250828',
} as const;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => {
      // 自动保存到服务器的辅助函数
      const autoSave = async () => {
        const state = get();
        try {
          const res = await fetch('/api/settings', {
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
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || `保存失败 (${res.status})`);
          }
          set({ saveStatus: 'saved' });
          // 2 秒后重置为 idle
          setTimeout(() => set({ saveStatus: 'idle' }), 2000);
        } catch (error) {
          set({
            saveStatus: 'error',
            saveError: error instanceof Error ? error.message : '保存失败'
          });
        }
      };

      // 内部设置函数，不触发 autoSave
      const setInternal = (updates: Partial<SettingsStore>) => {
        set(updates);
      };

      return {
        ...DEFAULT_SETTINGS,
        saveStatus: 'idle',
        saveError: null,

        setUseMockLLM: (useMock) => {
          set({ useMockLLM: useMock, saveStatus: 'saving' });
          autoSave();
        },
        setLLMEndpoint: (endpoint) => {
          set({ llmEndpoint: endpoint, saveStatus: 'saving' });
          autoSave();
        },
        setLLMKey: (key) => {
          set({ llmKey: key, saveStatus: 'saving' });
          autoSave();
        },
        setLLMModel: (model) => {
          set({ llmModel: model, saveStatus: 'saving' });
          autoSave();
        },
        setUseMockImage: (useMock) => {
          set({ useMockImage: useMock, saveStatus: 'saving' });
          autoSave();
        },
        setImageEndpoint: (endpoint) => {
          set({ imageEndpoint: endpoint, saveStatus: 'saving' });
          autoSave();
        },
        setImageKey: (key) => {
          set({ imageKey: key, saveStatus: 'saving' });
          autoSave();
        },
        setImageModel: (model) => {
          set({ imageModel: model, saveStatus: 'saving' });
          autoSave();
        },
        setSaveStatus: (status) => {
          set({ saveStatus: status });
        },

        loadSettingsFromServer: async () => {
          try {
            const res = await fetch('/api/settings', { credentials: 'include' });
            if (!res.ok) {
              throw new Error(`加载失败 (${res.status})`);
            }
            const data = await res.json();
            if (!data?.hasSavedSettings || !data.settings) {
              return;
            }

            const serverSettings = data.settings;
            setInternal({
              useMockLLM: serverSettings.useMockLLM ?? DEFAULT_SETTINGS.useMockLLM,
              llmEndpoint: serverSettings.llmEndpoint ?? DEFAULT_SETTINGS.llmEndpoint,
              llmKey: serverSettings.llmKey ?? DEFAULT_SETTINGS.llmKey,
              llmModel: serverSettings.llmModel ?? DEFAULT_SETTINGS.llmModel,
              useMockImage: serverSettings.useMockImage ?? DEFAULT_SETTINGS.useMockImage,
              imageEndpoint: serverSettings.imageEndpoint ?? DEFAULT_SETTINGS.imageEndpoint,
              imageKey: serverSettings.imageKey ?? DEFAULT_SETTINGS.imageKey,
              imageModel: serverSettings.imageModel ?? DEFAULT_SETTINGS.imageModel,
            });
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
