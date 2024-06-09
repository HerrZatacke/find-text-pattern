import { useState } from 'react';
import type { FuzzySearchResult, FuzzySearchQuery, FuzzySearchResponse } from '../../workers/fuzzySearch.worker';
import { useDataContext } from './useDataContext';


interface UseFuzzySearch {
  findClosest: (term: Uint8Array) => Promise<FuzzySearchResult>, // number[],
  busy: boolean,
  progress: number,
}

export const useFuzzySearch = (): UseFuzzySearch => {
  const { romContentArray } = useDataContext();
  const [busy, setBusy] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const findClosest = async (term: Uint8Array): Promise<FuzzySearchResult> => {
    setBusy(true);
    const worker = new Worker('./worker.js');

    const query: FuzzySearchQuery = { term, haystack: romContentArray };

    worker.postMessage(query);

    return new Promise((resolve) => {
      worker.onmessage = ({ data }: MessageEvent<FuzzySearchResponse>) => {
        if (typeof data.progress === 'number') {
          setProgress(data.progress);
        }

        if (data.result) {
          const result = data.result;
          worker.terminate();
          window.setTimeout(() => {
            setProgress(1);
            setBusy(false);
            resolve(result);
          }, 50);
        }
      };
    });
  };

  return {
    findClosest,
    busy,
    progress,
  };
};
