import { distance } from 'fastest-levenshtein';
import throttle from 'throttleit';

export interface FuzzySearchResult {
  score: number,
  pos: number,
}

const uInt8ArrayToString = (data: Uint8Array): string => (
  data.reduce((acc: string, code: number) => (
    `${acc}${String.fromCharCode(code)}`
  ), '')
);

const findClosestStep = (term: string, haystack: Uint8Array, logFn: (n: number) => void) => (
  stepPrecision: number,
  startIndex: number,
  length: number,
): FuzzySearchResult => {
  const termLength = term.length;

  const result = Array(length)
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

      return {
        score: newScore,
        pos: newScore === score ? start : acc.pos,
      };
    }, {
      score: Infinity,
      pos: 0,
    });

  return result;
};

const findClosest = (haystack: Uint8Array, term: Uint8Array, progressId: string): FuzzySearchResult => {
  const termStr = uInt8ArrayToString(term);
  const termLength = termStr.length;

  const precision = 64;

  let result = {
    score: termLength, // worst possible score
    pos: 0,
  };

  const logProgress = throttle((progress: number) => {
    const value = (result.score >= termLength) ? (progress * 0.7) : (0.7 + (progress * 0.3));
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({ progress: { progressId, value } });
  }, 250);

  const findClosestStepInHaystack = findClosestStep(termStr, haystack, logProgress);

  result = findClosestStepInHaystack(precision, 0, (haystack.byteLength - termLength) / precision);

  if (result.score > 0) {
    result = findClosestStepInHaystack(1, result.pos - precision, termLength * 2);
  }

  logProgress(1);
  return result;
};


// eslint-disable-next-line no-restricted-globals
self.onmessage = (event) => {
  const result = findClosest(event.data.haystack, event.data.term, event.data.progressId);
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({ result });
};
