export interface ImportFormData {
  vramOffset: string,
  tileMapOffset: string,
  tileMapUseLowerVRAM: boolean,
}

export interface VRAMButton {
  tiles: string[],
  data: Uint8Array,
  title: string,
  vramPadding: number,
}
