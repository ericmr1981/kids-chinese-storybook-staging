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
        useMockLLM: true,
        llmEndpoint: '/api/anthropic/v1/messages',
        llmKey: '',
        llmModel: 'qwen3-max-2026-01-23',
        useMockImage: true,
        imageEndpoint: '/api/ark/images/generations',
        imageKey: '',
        imageModel: 'doubao-seedream-4-0-250828',
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
            if (res.ok) {
              const data = await res.json();
              // 加载所有设置，如果服务器有值则覆盖本地默认值
              // 使用 !== undefined 判断，支持空字符串值
              if (data.useMockLLM !== undefined) setInternal({ useMockLLM: data.useMockLLM });
              if (data.useMockImage !== undefined) setInternal({ useMockImage: data.useMockImage });
              setInternal({
                llmEndpoint: data.llmEndpoint ?? '',
                llmKey: data.llmKey ?? '',
                llmModel: data.llmModel ?? '',
                imageEndpoint: data.imageEndpoint ?? '',
                imageKey: data.imageKey ?? '',
                imageModel: data.imageModel ?? '',
              });
              // zustand persist 会自动持久化到 localStorage
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