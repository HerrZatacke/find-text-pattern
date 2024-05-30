const readAllChunks = async (readableStream: ReadableStream): Promise<number[]> => {
  const reader = readableStream.getReader();
  const chunks: number[] = [];

  const pump = async (): Promise<number[]> => {
    const { value, done } = await reader.read();

    if (done) {
      return chunks;
    }

    chunks.push(...value);
    return pump();
  };

  return pump();
};

export const compress = async (v: ArrayBuffer): Promise<number[]> => {
  // eslint-disable-next-line no-undef
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(v);
  writer.close();
  return readAllChunks(cs.readable);
};

export const decompress = async (byteArray: Uint8Array): Promise<ArrayBuffer> => {
  // eslint-disable-next-line no-undef
  const cs = new DecompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();

  return new Response(cs.readable).arrayBuffer();
};

export const compressString = async (str: string): Promise<number[]> => {
  const textEncoder = new TextEncoder();
  return compress(textEncoder.encode(str).buffer);
};

export const decompressString = async (byteArray: Uint8Array): Promise<string> => {
  const buffer = await decompress(byteArray);
  const textDecoder = new TextDecoder('utf-8');
  return textDecoder.decode(buffer);
};
