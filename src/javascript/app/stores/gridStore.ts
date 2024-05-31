import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface GridState {
  grid: string,
  gridGroups: number,
  gridCols: number,
  setGridGroups: (groups: string) => void,
  setGridCols: (cols: string) => void,
}

const createGrid = (cols: number, groups: number): string => {
  const segments = [...Array(groups)]
    .map((_, index) => (
      `repeat(${index ? cols - 1 : cols}, 40px)`
    ));

  return segments.join(' 60px ');
};

const useGridStore = create(
  persist<GridState>(
    (set, getState) => ({
      grid: 'repeat(14, 40px) 60px repeat(13, 40px)',
      gridGroups: 2,
      gridCols: 16,

      setGridGroups: (gridGroups: string) => {
        const { gridCols } = getState();
        set(() => ({
          gridGroups: parseInt(gridGroups, 10),
          grid: createGrid(gridCols, parseInt(gridGroups, 10)),
        }));
      },

      setGridCols: (gridCols: string) => {
        const { gridGroups } = getState();
        set(() => ({
          gridCols: parseInt(gridCols, 10),
          grid: createGrid(parseInt(gridCols, 10), gridGroups),
        }));
      },
    }),
    {
      name: 'find-text-pattern-grid',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useGridStore;
