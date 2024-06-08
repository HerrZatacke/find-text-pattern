import { distance } from 'fastest-levenshtein';
import throttle from 'throttleit';
import chunk from 'chunk';

const MEMORY_BANK_SIZE = 0x4000;
const INITIAL_PRECISION = 128;

export interface FuzzySearchQuery {
  haystack: Uint8Array,
  term: Uint8Array,
  progressId: string,
}

export interface FuzzySearchResult {
  score: number,
  pos: number,
}

const dummyResult: () => FuzzySearchResult = () => ({
  score: Infinity,
  pos: 0,
});

const uInt8ArrayToString = (data: Uint8Array): string => (
  data.reduce((acc: string, code: number) => (
    `${acc}${String.fromCharCode(code)}`
  ), '')
);

const findClosestStep = (
  term: string,
  haystack: Uint8Array,
  bankIndex: number,
  logFn: (n: number) => void,
) => (
  stepPrecision: number,
  startIndex: number,
  length: number,
): FuzzySearchResult => {
  const termLength = term.length;

  const finalResult = Array(length)
    .fill('')
    .reduce((acc: FuzzySearchResult, _, s: number): FuzzySearchResult => {
      if (acc.score === 0) {
        return acc;
      }

      logFn(s / length);

      const start = (s * stepPrecision) + startIndex;
      const termHay = uInt8ArrayToString(haystack.slice(start, start + termLength));
      const score = distance(term, termHay);
      const newScore = Math.min(score, acc.score);

      const tempResult = {
        score: newScore,
        pos: newScore === score ? (bankIndex * MEMORY_BANK_SIZE) + start : acc.pos,
      };

      return tempResult;
    }, dummyResult());

  return finalResult;
};

const findClosest = (
  haystack: Uint8Array,
  term: Uint8Array,
  progressId: string,
  bankIndex: number,
): FuzzySearchResult => {
  const termStr = uInt8ArrayToString(term);
  const termLength = termStr.length;

  let result = dummyResult();

  const logProgress = throttle((progress: number) => {
    const bankValue = (result.score >= termLength) ? (progress * 0.7) : (0.7 + (progress * 0.3));
    const value = (bankIndex + bankValue) / 64;
    self.postMessage({ progress: { progressId, value } });
  }, 250);

  const findClosestStepInHaystack = findClosestStep(termStr, haystack, bankIndex, logProgress);

  result = findClosestStepInHaystack(INITIAL_PRECISION, 0, (haystack.byteLength - termLength) / INITIAL_PRECISION);

  if (result.score > 0) {
    result = findClosestStepInHaystack(1, result.pos - INITIAL_PRECISION, INITIAL_PRECISION * 2);
  }

  logProgress(1);
  return result;
};


self.onmessage = async (event: MessageEvent<FuzzySearchQuery>) => {
  const { progressId, term, haystack } = event.data;

  const banks = chunk(haystack, MEMORY_BANK_SIZE); // GameBoy ROM memory bank size
  const haybales = banks.map((ns) => new Uint8Array(ns));

  const start = Date.now();

  const result = haybales.reduce((
    acc: FuzzySearchResult,
    haybale: Uint8Array,
    bankIndex: number,
  ): FuzzySearchResult => {
    if (acc.score === 0) {
      return acc;
    }

    const found = findClosest(haybale, term, progressId, bankIndex);

    return found.score < acc.score ? found : acc;
  }, dummyResult());

  // eslint-disable-next-line no-console
  console.log(`${progressId} - done after ${Date.now() - start}ms`);

  self.postMessage({ result });
};
