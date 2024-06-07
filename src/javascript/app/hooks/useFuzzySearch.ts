import type { FuzzySearchResult } from '../../workers/fuzzySearch.worker';
import useProgressStore from '../stores/progressStore';
import { useDataContext } from './useDataContext';

interface UseFuzzySearch {
  findClosest: (term: Uint8Array, progressId: string) => Promise<FuzzySearchResult>, // number[],
}

export const useFuzzySearch = (): UseFuzzySearch => {
  const { romContentArray } = useDataContext();

  const { setProgress } = useProgressStore();

  const findClosest = async (term: Uint8Array, progressId: string): Promise<FuzzySearchResult> => {
    const worker = new Worker('./worker.js');

    worker.postMessage({ term, haystack: romContentArray, progressId });

    return new Promise((resolve) => {
      worker.onmessage = ({ data: { result, progress } }) => {
        if (progress) {
          setProgress({
            id: progress.progressId,
            value: progress.value,
          });
        }

        if (result) {
          resolve(result);
        }
      };
    });
  };

  return {
    findClosest,
  };
};
