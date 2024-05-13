import React from 'react';
import { clsx } from 'clsx';
import type { CSSPropertiesVars } from 'react';
import type { MapCharGroup } from '../../../../types/MapChar';
import { charGroups, GROUP_UNKNOWN } from '../../../../constants/charGroups';
import { hexPad } from '../../../tools/hexPad';
import { findCharByCode } from '../../../tools/findChar';

import './index.scss';

interface Props {
  code: number,
  appendText: (appens: string) => void,
}

function Char({ code, appendText }: Props) {
  const styles: CSSPropertiesVars = {};

  const char = findCharByCode(code);

  if (char?.groupId) {
    const groupId = char.groupId;
    const mapCharGroup: MapCharGroup = charGroups.find((charGroup) => charGroup.groupId === groupId) || GROUP_UNKNOWN;
    if (mapCharGroup?.color) {
      styles['--bg-color'] = mapCharGroup.color;
    }

    if (mapCharGroup?.textColor) {
      styles['--text-color'] = mapCharGroup.textColor;
    }
  }

  return (
    <button
      className={clsx('char', { 'char--missing': char?.code === undefined })}
      type="button"
      disabled={char?.code === undefined}
      style={styles}
      onClick={() => appendText(char?.value || '')}
    >
      { char && (
        <>
          <span className="char__value">{char.value}</span>
          <span className="char__code">
            { hexPad(char.code) }
          </span>
        </>
      ) }
    </button>
  );
}

export default Char;
