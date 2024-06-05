import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SettingsState {
  renderTextGrid: boolean,
  setRenderTextGrid: (visible: boolean) => void,
  renderHexChars: boolean,
  setRenderHexChars: (visible: boolean) => void,
}

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      renderTextGrid: false,
      renderHexChars: false,

      setRenderTextGrid: (renderTextGrid: boolean) => {
        set(() => ({
          renderTextGrid,
        }));
      },

      setRenderHexChars: (renderHexChars: boolean) => {
        set(() => ({
          renderHexChars,
        }));
      },
    }),
    {
      name: 'find-text-pattern-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
