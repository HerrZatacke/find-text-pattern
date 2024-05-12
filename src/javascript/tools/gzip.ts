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

export const compress = async (v: ArrayBuffer) => {
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
