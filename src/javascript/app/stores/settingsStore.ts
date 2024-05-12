import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SettingsState {
  charMapVisible: boolean,
  setCharMapVisible: (visible: boolean) => void,
  renderTextGrid: boolean,
  setRenderTextGrid: (visible: boolean) => void,
}

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      charMapVisible: false,
      renderTextGrid: false,

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
    }),
    {
      name: 'find-text-pattern-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
