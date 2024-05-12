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
import './index.scss';

function Render() {
  const styles: CSSPropertiesVars = {};

  const rawPattern = usePatternStore((state) => state.rawPattern);

  const renderTextGrid = useSettingsStore((state) => (state.renderTextGrid));

  const grid = useGridStore((state) => (state.grid));

  const {
    romContent,
    romSize,
    pageSize,
    romPage,
  } = useRomStore((state) => ({
    romContent: state.romContent,
    romSize: state.romSize,
    pageSize: state.pageSize,
    romPage: state.romPage,
  }));

  const { found, currentFound } = usePatternStore((state) => ({
    found: state.found,
    currentFound: state.currentFound,
  }));

  const pageOffset = (parseInt(romPage, 10) || 0) * parseInt(pageSize, 10);

  const mappedChars = useMemo<MapChar[]>(() => {
    let view: Uint8Array;
    if (romSize) {
      const bufferPart = romContent.slice(pageOffset, pageOffset + parseInt(pageSize, 10));
      view = new Uint8Array(bufferPart);
    } else {
      view = rawPattern;
    }

    return (
      view.reduce((acc: MapChar[], code: number) => (
        acc.concat(findCharByCode(code) || BAD_CHAR)
      ), [])
    );
  }, [pageOffset, pageSize, rawPattern, romContent, romSize]);

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
                key={index}
                highlight={loopFound > 0}
                highlightCurrent={loopFoundExtra}
                index={pageOffset + index}
                char={char}
                loopClass={loopClass}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Render;
