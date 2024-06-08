import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SearchStoreState {
  found: number[],
  currentFound: number,
  searchLength: number,
  setCurrentFound: (found: number) => void,
  setFound: (found: number[], searchLength: number) => void,
}

const useSearchStore = create(
  persist<SearchStoreState>(
    (set) => ({
      currentFound: 0,
      found: [],
      searchLength: 0,

      setFound: (found: number[], searchLength: number) => {
        set({
          currentFound: 0,
          found,
          searchLength,
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
