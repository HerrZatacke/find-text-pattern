export enum MapCharTask {
  ONES_CHAR = 'ones',
  TENS_CHAR = 'tens',
  HUNDREDS_CHAR = 'hundreds',
  FONT_BOLD = 'bold',
  FONT_SLIM = 'slim',
  STRING_TERM = 'term',
}


export interface MapChar {
  code: number,
  value: string,
  groupId?: string,
  special?: MapCharTask,
  patched?: boolean,
}

export interface MapCharGroup {
  groupId: string,
  color?: string,
  textColor?: string,
}

export interface Patch {
  location: number,
  code: number,
}
