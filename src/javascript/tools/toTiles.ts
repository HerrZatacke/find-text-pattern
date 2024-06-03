import chunk from 'chunk';
import { hexPadSimple } from './hexPad';

export const toTilesRaw = (data: Uint8Array | number[]): number[][] => (
  [...chunk(data, 16)]
);

export const toTiles = (data: Uint8Array | number[]): string[] => (
  toTilesRaw(data)
    .map((tile: number[]) => (
      [...tile].map((byte: number) => (
        hexPadSimple(byte, 2)
      )).join('')
    ))
);
