import { useMemo } from 'react';

export const useRandomId = () => (
  useMemo(() => Math.random().toString(16).split('.')[1], [])
);
