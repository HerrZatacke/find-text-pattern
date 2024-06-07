/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex,no-nested-ternary */
import React from 'react';
import type { CSSPropertiesVars, MouseEvent } from 'react';
import { clsx } from 'clsx';
import { CharRender } from '../../../stores/settingsStore';
import type { MapChar } from '../../../../../types/MapChar';
import { MapCharTask } from '../../../../../types/MapChar';
import { charGroups } from '../../../../../constants/charGroups';
import { hexPad, hexPadSimple } from '../../../../tools/hexPad';

import './index.scss';

interface Props {
  char: MapChar,
  globalOffset: number,
  pageOffset: number,
  loopClass: string,
  highlight: boolean,
  highlightCurrent: boolean,
  charStyle: CharRender,
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
  charStyle,
  setEditLocation,
  handleContextMenu,
}: Props) {
  const title = `Global: ${hexPad(globalOffset, 6)} (byte ${globalOffset})\nIn Page: ${hexPad(pageOffset, 6)} (byte ${pageOffset})`;
  const styles: CSSPropertiesVars = {};

  const CHAR_SIZE = 40;

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

    if (charStyle === CharRender.HEX) {
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
      className={clsx('render-char', `render-char--${loopClass}`, {
        'render-char--terminator': MapCharTask.STRING_TERM === char.special,
        'render-char--fontchange': [MapCharTask.FONT_SLIM, MapCharTask.FONT_BOLD].includes(char.special as MapCharTask),
        'render-char--highlight': highlight,
        'render-char--highlight-current': highlightCurrent,
        'render-char--patched': char.patched,
        'render-char--style-hex': charStyle === CharRender.HEX,
        'render-char--style-tilemap': charStyle === CharRender.TILE_MAP,
        'render-char--style-charmap': charStyle === CharRender.CHAR_MAP,
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
        style={(charStyle === CharRender.TILE_MAP) ? {
          backgroundPositionX: `${(char.code % 16) * CHAR_SIZE * -1}px`,
          backgroundPositionY: `${Math.floor(char.code / 16) * CHAR_SIZE * -1}px`,
        } : undefined}
      >
        { charStyle !== CharRender.CHAR_MAP ? hexPadSimple(char.code) : textValue }
      </div>
    </div>
  );
}

export default RenderChar;
