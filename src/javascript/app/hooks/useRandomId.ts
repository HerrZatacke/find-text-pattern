import { useMemo } from 'react';

export const createRandomId = () => (
  Math.random().toString(16).split('.')[1]
);

export const useRandomId = () => (
  useMemo<string>(createRandomId, [])
);
