import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SettingsState {
  charMapVisible: boolean,
  setCharMapVisible: (visible: boolean) => void,
  renderTextGrid: boolean,
  setRenderTextGrid: (visible: boolean) => void,
  renderHexChars: boolean,
  setRenderHexChars: (visible: boolean) => void,
}

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      charMapVisible: false,
      renderTextGrid: false,
      renderHexChars: false,

      setCharMapVisible: (charMapVisible: boolean) => {
        set(() => ({
          charMapVisible,
        }));
      },

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
