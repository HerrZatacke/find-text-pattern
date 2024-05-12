import { charMap } from '../../constants/charMap';
import type { MapChar } from '../../types/MapChar';

export const findCharByCode = (code: number): MapChar | null => (
  charMap.find((char) => char.code === code) || null
);

export const findCharByValue = (value: string): MapChar | null => (
  charMap.find((char) => char.value === value) || null
);
