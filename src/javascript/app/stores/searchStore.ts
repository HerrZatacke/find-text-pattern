import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SearchStoreState {
  found: number[],
  currentFound: number,
  setCurrentFound: (found: number) => void,
  setFound: (found: number[]) => void,
}

const useSearchStore = create(
  persist<SearchStoreState>(
    (set) => ({
      currentFound: 0,
      found: [],

      setFound: (found: number[]) => {
        set({
          currentFound: 0,
          found,
        });
      },

      setCurrentFound: (currentFound: number) => {
        set({
          currentFound,
        });
      },
    }),
    {
      name: 'find-text-pattern-search',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSearchStore;
