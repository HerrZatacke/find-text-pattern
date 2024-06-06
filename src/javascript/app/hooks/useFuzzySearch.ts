import type { FuzzySearchResult } from '../../workers/fuzzySearch.worker';
import { useRom } from './useRom';
import useProgressStore from '../stores/progressStore';

interface UseFuzzySearch {
  findClosest: (term: Uint8Array, progressId: string) => Promise<FuzzySearchResult>, // number[],
}

export const useFuzzySearch = (): UseFuzzySearch => {
  const { romContent } = useRom();

  const { setProgress } = useProgressStore();

  const findClosest = async (term: Uint8Array, progressId: string): Promise<FuzzySearchResult> => {
    const worker = new Worker('/worker.js');

    worker.postMessage({ term, haystack: romContent, progressId });

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
