import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hexStringToNumeric } from '../../tools/hexStringToNumeric';
import { numericToHexString } from '../../tools/numericToHexString';
import { stringToNumeric } from '../../tools/stringToNumeric';
import { numericToString } from '../../tools/numericToString';
import { createCompressedJSONStorage } from '../../tools/zustand/createCompressedStorage';

export interface PatternStoreState {
  rawPattern: Uint8Array,

  setText: (text: string) => void,
  inputTextError: string | null,
  text: string,
  appendText: (text: string) => void,

  setHex: (hexText: string) => void,
  inputHexError: string | null,
  hex: string,
  cleanHex: () => void,
}

const usePatternStore = create(
  persist<PatternStoreState>(
    (set, getState) => ({
      rawPattern: new Uint8Array([]),
      text: '',
      hex: '',
      inputTextError: null,
      inputHexError: null,

      setText: (text: string) => {
        try {
          const rawPattern = stringToNumeric(text);
          const hex = numericToHexString(rawPattern, 32);
          set(() => ({
            text,
            hex,
            inputTextError: null,
            inputHexError: null,
            rawPattern,
            currentFound: 0,
            found: [],
          }));
        } catch (error) {
          set(() => ({
            text,
            inputTextError: (error as Error).message,
            currentFound: 0,
            found: [],
          }));
        }
      },

      appendText: (append: string) => {
        const { text, setText } = getState();
        setText(`${text}${append}`);
      },

      setHex: (hex: string) => {
        try {
          const rawPattern = hexStringToNumeric(hex);
          const text = numericToString(rawPattern);
          set(() => ({
            text,
            hex,
            inputTextError: null,
            inputHexError: null,
            rawPattern,
            currentFound: 0,
            found: [],
          }));
        } catch (error) {
          set(() => ({
            hex,
            inputHexError: (error as Error).message,
            currentFound: 0,
            found: [],
          }));
        }
      },

      cleanHex: () => {
        try {
          const {
            inputHexError,
            inputTextError,
            rawPattern,
            setHex,
          } = getState();

          if (inputHexError || inputTextError) {
            return;
          }

          setHex(numericToHexString(rawPattern, 32));
        } catch (error) {
          set(() => ({
            inputHexError: (error as Error).message,
            currentFound: 0,
            found: [],
          }));
        }
      },
    }),
    {
      name: 'find-text-pattern-pattern',
      storage: createCompressedJSONStorage(() => localStorage, { arrayBufferFields: ['rawPattern'] }),
    },
  ),
);

export default usePatternStore;
