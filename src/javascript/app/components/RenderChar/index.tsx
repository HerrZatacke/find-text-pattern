/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import type { CSSPropertiesVars, MouseEvent } from 'react';
import { clsx } from 'clsx';
import type { MapChar } from '../../../../types/MapChar';
import { MapCharTask } from '../../../../types/MapChar';
import { charGroups } from '../../../../constants/charGroups';
import { hexPad, hexPadSimple } from '../../../tools/hexPad';

import './index.scss';

interface Props {
  char: MapChar,
  globalOffset: number,
  pageOffset: number,
  loopClass: string,
  highlight: boolean,
  highlightCurrent: boolean,
  renderHexChar: boolean,
  setEditLocation: (editLocation: number) => void,
  handleContextMenu: (event: MouseEvent, location: number) => void,
}

function RenderChar({
  char,
  globalOffset,
  pageOffset,
  loopClass,
  highlight,
  highlightCurrent,
  renderHexChar,
  setEditLocation,
  handleContextMenu,
}: Props) {
  const title = `Global: ${hexPad(globalOffset, 6)} (byte ${globalOffset})\nIn Page: ${hexPad(pageOffset, 6)} (byte ${pageOffset})`;
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

    if (!renderHexChar) {
      if (mapCharGroup?.groupId === 'digits') {
        textValue = 'n';
      }

      if (mapCharGroup?.groupId === 'blank') {
        textValue = '␣';
      }
    }
  }

  return (
    <div
      className={clsx('render-char', `render-char__${loopClass}`, {
        'render-char__hex': renderHexChar,
        'render-char__terminator': MapCharTask.STRING_TERM === char.special,
        'render-char__fontchange': [MapCharTask.FONT_SLIM, MapCharTask.FONT_BOLD].includes(char.special as MapCharTask),
        'render-char__highlight': highlight,
        'render-char__highlight-current': highlightCurrent,
        'render-char__patched': char.patched,
      })}
      title={title}
      style={styles}
    >
      <div
        className="render-char__char"
        tabIndex={0}
        onContextMenu={(ev) => handleContextMenu(ev, globalOffset)}
        onKeyDown={(ev) => {
          if ((ev.key === 'Enter') || ev.key === ' ') {
            ev.preventDefault();
            setEditLocation(globalOffset);
          }
        }}
      >
        { renderHexChar ? hexPadSimple(char.code) : textValue }
      </div>
    </div>
  );
}

export default RenderChar;
