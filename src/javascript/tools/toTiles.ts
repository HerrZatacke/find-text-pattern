import chunk from 'chunk';
import { hexPadSimple } from './hexPad';

export const toTiles = (data: Uint8Array | number[]): string[] => (
  [...chunk(data, 16)]
    .map((tile: number[]) => (
      [...tile].map((byte: number) => (
        hexPadSimple(byte, 2)
      )).join('')
    ))
);
