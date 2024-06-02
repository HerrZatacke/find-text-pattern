import type { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware/persist';


const readAllChunks = async (readableStream: ReadableStream): Promise<string> => {
  const reader = readableStream.getReader();
  let result = '';

  const pump = async (): Promise<string> => {
    const { value, done } = await reader.read();

    if (done) {
      return result;
    }

    result = value.reduce((acc: string, code: number) => (
      `${acc}${String.fromCharCode(code)}`
    ), result);
    return pump();
  };

  return pump();
};

const compress = async (value: ArrayBuffer): Promise<string> => {
  // eslint-disable-next-line no-undef
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(value);
  writer.close();
  return readAllChunks(cs.readable);
};

const decompress = async (data: string): Promise<ArrayBuffer> => {
  const byteArray = new Uint8Array(data.split('').map((char) => char.charCodeAt(0)));
  // eslint-disable-next-line no-undef
  const cs = new DecompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();

  return new Response(cs.readable).arrayBuffer();
};

export interface CompressedJSONStorageOptions<S> {
  arrayBufferFields: (keyof S)[],
}

export function createCompressedJSONStorage<S>(
  getStorage: () => StateStorage,
  options: CompressedJSONStorageOptions<S>,
): PersistStorage<S> | undefined {
  let storage: StateStorage | undefined;
  try {
    storage = getStorage();
  } catch (error) {
    // prevent error if the storage is not defined (e.g. when server side rendering a page)
    return undefined;
  }

  const persistStorage: PersistStorage<S> = {
    getItem: async (name) => {
      const parse = async (str: string | null) => {
        if (str === null) {
          return null;
        }

        const raw = JSON.parse(str);

        const uncompressedFields = (await Promise.all(
          options.arrayBufferFields.map(async (fieldKey: keyof S): Promise<[keyof S, ArrayBuffer]> => ([
            fieldKey,
            await decompress(raw.state[fieldKey]),
          ])),
        ));

        const state = {
          ...raw.state,
          ...Object.fromEntries(uncompressedFields),
        };

        return {
          ...raw,
          state,
        } as StorageValue<S>;
      };

      const str = await (storage as StateStorage).getItem(name) ?? null;

      return parse(str);
    },
    setItem: async (name, newValue) => {

      const compressedFields = (await Promise.all(
        options.arrayBufferFields.map(async (fieldKey: keyof S): Promise<[keyof S, string]> => ([
          fieldKey,
          await compress(newValue.state[fieldKey] as ArrayBuffer),
        ])),
      ));

      const state = {
        ...newValue.state,
        ...Object.fromEntries(compressedFields),
      };

      return (storage as StateStorage).setItem(
        name,
        JSON.stringify({
          ...newValue,
          state,
        }),
      );
    },
    removeItem: (name) => (storage as StateStorage).removeItem(name),
  };

  return persistStorage;
}
