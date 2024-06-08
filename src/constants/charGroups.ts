import type { MapCharGroup } from '../types/MapChar';

export const GROUP_UNKNOWN: MapCharGroup = {
  groupId: 'unknown',
  color: '#ebdcff',
};

export const charGroups: MapCharGroup[] = [
  {
    groupId: 'term',
    color: '#ffdcdc',
  },
  {
    groupId: 'char',
    color: '#fff4c1',
  },
  {
    groupId: 'blank',
    color: '#d0ffba',
    textColor: '#dcdcdc',
  },
  {
    groupId: 'digits',
    color: '#beffe0',
  },
  {
    groupId: 'font',
    color: '#b9e3ff',
  },
  GROUP_UNKNOWN,
];
