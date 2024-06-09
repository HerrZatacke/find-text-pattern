export interface ImportFormData {
  vramOffset: string,
  tileMapOffset: string,
}

export interface VRAMButton {
  tiles: string[],
  data: Uint8Array,
  title: string,
  vramPadding: number,
}
