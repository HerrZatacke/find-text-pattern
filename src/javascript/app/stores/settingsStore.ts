import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum CharRender {
  CHAR_MAP = 'charMap',
  TILE_MAP = 'tileMap',
  HEX = 'hex',
}

export interface SettingsState {
  renderTextGrid: boolean,
  setRenderTextGrid: (visible: boolean) => void,
  charStyle: CharRender,
  setCharStyle: (charStyle: CharRender) => void,
}

const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      renderTextGrid: false,
      charStyle: CharRender.CHAR_MAP,

      setRenderTextGrid: (renderTextGrid: boolean) => {
        set(() => ({
          renderTextGrid,
        }));
      },

      setCharStyle: (charStyle: CharRender) => {
        set(() => ({
          charStyle,
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
