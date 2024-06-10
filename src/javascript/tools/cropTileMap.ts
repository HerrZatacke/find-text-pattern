import chunk from 'chunk';

export interface ScreenCutOut {
  xOffset: number,
  yOffset: number,
  width: number,
  height: number,
}


export const cropTileMap = (tilemap: Uint8Array | number[], crop: ScreenCutOut): number[] => {
  const mapLines = chunk([...tilemap], 32);

  const horizontalCrop = mapLines.filter((_, lineIndex) => {
    if (lineIndex < crop.yOffset) {
      return false;
    }

    if (lineIndex >= crop.height + crop.yOffset) {
      return false;
    }

    return true;
  });

  const croppedMap = horizontalCrop.map((line) => {
    const verticalCrop = line.filter((_, columnIndex) => {
      if (columnIndex < crop.xOffset) {
        return false;
      }

      if (columnIndex >= crop.width + crop.xOffset) {
        return false;
      }

      return true;

    });

    return verticalCrop;
  });

  return croppedMap.reduce((acc: number[], line: number[]): number[] => (
    [...acc, ...line]
  ), []);
};
