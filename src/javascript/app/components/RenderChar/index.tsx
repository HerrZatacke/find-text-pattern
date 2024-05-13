import type { CSSPropertiesVars } from 'react';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import type { MapChar } from '../../../../types/MapChar';
import { MapCharTask } from '../../../../types/MapChar';
import { charGroups } from '../../../../constants/charGroups';
import { hexPad } from '../../../tools/hexPad';


import './index.scss';
import { findCharByValue } from '../../../tools/findChar';

interface Props {
  char: MapChar,
  globalOffset: number,
  pageOffset: number,
  loopClass: string,
  highlight: boolean,
  highlightCurrent: boolean,
  update: (location: number, code: number) => void,
}

function RenderChar({
  char,
  globalOffset,
  pageOffset,
  loopClass,
  highlight,
  highlightCurrent,
  update,
}: Props) {
  const [editChar, setEditChar] = useState<MapChar | null>(null);
  const title = `${hexPad(globalOffset, 6)}\n${hexPad(pageOffset, 6)}`;
  const styles: CSSPropertiesVars = {};

  let textValue = char.value;

  if (char.groupId) {
    const groupId = char.groupId;
    const mapCharGroup = charGroups.find((charGroup) => charGroup.groupId === groupId);
    if (mapCharGroup?.color) {
      styles['--bg-color'] = mapCharGroup.color;
    }

    if (mapCharGroup?.textColor) {
      styles['--text-color'] = mapCharGroup.textColor;
    }

    if (mapCharGroup?.groupId === 'digits') {
      textValue = 'n';
    }

    if (mapCharGroup?.groupId === 'blank') {
      textValue = '␣';
    }
  }

  return (
    <div
      className={clsx('render-char', `render-char__${loopClass}`, {
        'render-char__terminator': MapCharTask.STRING_TERM === char.special,
        'render-char__fontchange': [MapCharTask.FONT_SLIM, MapCharTask.FONT_BOLD].includes(char.special as MapCharTask),
        'render-char__highlight': highlight,
        'render-char__highlight-current': highlightCurrent,
        'render-char__patched': char.patched,
        'render-char__bad-edit': editChar?.code === -1,
      })}
      title={title}
      style={styles}
      // data-global-offset={globalOffset}
    >
      { editChar !== null ? (
        <input
          type="text"
          className="render-char__char"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          value={editChar?.value || ''}
          maxLength={1}
          onFocus={({ target }) => target.select()}
          onChange={({ target }) => {
            const newEditChar = findCharByValue(target.value);

            if (newEditChar) {
              update(globalOffset, newEditChar.code);
              setEditChar(null);
              return;
            }

            setEditChar({
              value: target.value,
              code: -1,
            });
          }}
          onBlur={() => {
            if (editChar && editChar.code !== -1) {
              update(globalOffset, editChar.code);
            }

            setEditChar(null);
          }}
        />
      ) : (
        <button
          className="render-char__char"
          type="button"
          onFocus={() => {
            setEditChar(char);
          }}
        >
          { textValue }
        </button>
      ) }
    </div>
  );
}

export default RenderChar;
