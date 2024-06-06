import { create } from 'zustand';

interface Progress {
  id: string,
  value: number,
}

export interface ProgressState {
  progresss: Progress[],
  setProgress: (progress: Progress) => void,
}

const useProgressStore = create<ProgressState>(
  (set, getState) => ({
    progresss: [],

    setProgress: (newProgress: Progress) => {
      const { progresss } = getState();

      const isNew = !progresss.find(({ id }) => newProgress.id === id);

      const progressUpdates = progresss.reduce((acc: Progress[], progress: Progress): Progress[] => {
        if (progress.id !== newProgress.id) {
          return [...acc, progress];
        }

        if (newProgress.value >= 1) {
          return acc;
        }

        return [...acc, newProgress];
      }, isNew ? [newProgress] : []);

      set(() => ({
        progresss: progressUpdates,
      }));
    },
  }),
);

export default useProgressStore;
