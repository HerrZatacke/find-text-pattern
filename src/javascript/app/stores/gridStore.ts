import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface GridState {
  grid: string,
  gridRows: string,
  gridCols: string,
  setGridRows: (rows: string) => void,
  setGridCols: (cols: string) => void,
}

const createGrid = (cols: number, rows: number): string => {
  const segments = [...Array(rows)]
    .map((_, index) => (
      `repeat(${index ? cols - 1 : cols}, 40px)`
    ));

  return segments.join(' 60px ');
};

const useGridStore = create(
  persist<GridState>(
    (set, getState) => ({
      grid: 'repeat(14, 40px) 60px repeat(13, 40px)',
      gridRows: '2',
      gridCols: '16',

      setGridRows: (gridRows: string) => {
        const gridCols = getState().gridCols;
        set(() => ({
          gridCols,
          gridRows,
          grid: createGrid(parseInt(gridCols, 10), parseInt(gridRows, 10)),
        }));
      },

      setGridCols: (gridCols: string) => {
        const gridRows = getState().gridRows;
        set(() => ({
          gridCols,
          gridRows,
          grid: createGrid(parseInt(gridCols, 10), parseInt(gridRows, 10)),
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
