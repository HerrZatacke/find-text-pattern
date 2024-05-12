import type { MapCharGroup } from '../types/MapChar';

export const GROUP_UNKNOWN: MapCharGroup = {
  groupId: 'unknown',
  color: '235 220 255',
};

export const charGroups: MapCharGroup[] = [
  {
    groupId: 'term',
    color: '255 220 220',
  },
  {
    groupId: 'char',
    color: '255 244 193',
  },
  {
    groupId: 'blank',
    color: '208 255 186',
    textColor: '220 220 220',
  },
  {
    groupId: 'digits',
    color: '190 255 224',
  },
  {
    groupId: 'font',
    color: '185 227 255',
  },
  GROUP_UNKNOWN,
];
