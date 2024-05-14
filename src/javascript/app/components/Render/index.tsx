import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import type { CSSPropertiesVars } from 'react';
import type { MapChar } from '../../../../types/MapChar';
import usePatternStore from '../../stores/patternStore';
import { findCharByCode } from '../../../tools/findChar';
import { BAD_CHAR } from '../../../../constants/charMap';
import RenderChar from '../RenderChar';
import { MapCharTask } from '../../../../types/MapChar';
import useGridStore from '../../stores/gridStore';
import useRomStore from '../../stores/romStore';
import useSettingsStore from '../../stores/settingsStore';
import { useSearch } from '../../hooks/useSearch';
import { usePatch } from '../../hooks/usePatch';

import './index.scss';

function Render() {
  const styles: CSSPropertiesVars = {};

  const { rawPattern } = usePatternStore();

  const { renderTextGrid, renderHexChars } = useSettingsStore();

  const { grid } = useGridStore();

  const {
    romContent,
    romSize,
    pageSize,
    romPage,
  } = useRomStore();

  const { found, currentFound } = useSearch();

  const { patches, setEditLocation } = usePatch();

  const pageOffset = romPage * pageSize;

  const mappedChars = useMemo<MapChar[]>(() => {
    let view: Uint8Array;
    if (romSize) {
      const bufferPart = romContent.slice(pageOffset, pageOffset + pageSize);
      view = new Uint8Array(bufferPart);
    } else {
      view = rawPattern;
    }

    return (
      view.reduce((acc: MapChar[], code: number, index: number): MapChar[] => {
        const globalIndex = index + pageOffset;
        const patch = patches.find(({ location }) => location === globalIndex);

        let char = findCharByCode(patch?.code || code);

        if (char && patch) {
          char = {
            ...char,
            patched: true,
          };
        }

        return (acc.concat(char || BAD_CHAR)
        );
      }, [])
    );
  }, [pageOffset, pageSize, patches, rawPattern, romContent, romSize]);

  styles['--grid'] = grid;

  let loopClass = 'norm';
  let loopFound = 0;
  let loopFoundExtra = false;

  return (
    <div className="render grid__container" style={styles}>
      <div className="render__grid  grid__col grid__col--12">
        <div
          className={clsx('render__list', {
            'render__list--textgrid': renderTextGrid,
          })}
        >
          {mappedChars.map((char, index) => {
            if (char.special === MapCharTask.FONT_BOLD) {
              loopClass = 'bold';
            }

            if ((char.special === MapCharTask.FONT_SLIM) ||
              (char.special === MapCharTask.STRING_TERM)) {
              loopClass = 'norm';
            }

            const foundTest = found.findIndex((location) => location === pageOffset + index);
            if (foundTest > -1) {
              loopFound = rawPattern.length;
              if (foundTest === currentFound) {
                loopFoundExtra = true;
              }
            } else {
              loopFound = Math.max(loopFound - 1, 0);
              if (loopFound === 0) {
                loopFoundExtra = false;
              }
            }

            return (
              <RenderChar
                key={pageOffset + index}
                highlight={loopFound > 0}
                highlightCurrent={loopFoundExtra}
                globalOffset={pageOffset + index}
                pageOffset={index}
                char={char}
                renderHexChar={renderHexChars}
                loopClass={loopClass}
                setEditLocation={setEditLocation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Render;
