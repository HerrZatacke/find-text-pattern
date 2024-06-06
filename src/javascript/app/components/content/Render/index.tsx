import React, { useState } from 'react';
import { clsx } from 'clsx';
import type { CSSPropertiesVars, MouseEvent } from 'react';
import { Menu, MenuItem, Stack } from '@mui/material';
import { MapCharTask } from '../../../../../types/MapChar';
import usePatternStore from '../../../stores/patternStore';
import useGridStore from '../../../stores/gridStore';
import useSettingsStore from '../../../stores/settingsStore';
import RenderChar from '../RenderChar';
import RomPagination from '../RomPagination';
import { useRom } from '../../../hooks/useRom';
import { useRam } from '../../../hooks/useRam';
import { useSearch } from '../../../hooks/useSearch';
import { usePatch } from '../../../hooks/usePatch';
import { useContextMenu } from '../../../hooks/useContextMenu';

import './index.scss';
import { useRomListeners } from '../../../hooks/useRomListeners';
import RenderGridOptions from '../RenderGridOptions';
import { hexPad } from '../../../../tools/hexPad';

function Render() {
  const styles: CSSPropertiesVars = {};

  const { rawPattern } = usePatternStore();

  const { renderTextGrid, renderHexChars } = useSettingsStore();

  const { grid } = useGridStore();

  useRomListeners();

  const {
    pageSize,
    romPage,
  } = useRom();

  const {
    vramTilesOffset,
    vramMapOffset,
    setVRAMTilesOffset,
    setVRAMMapOffset,
  } = useRam();

  const { found, currentFound } = useSearch();

  const { setEditLocation, patchedPage } = usePatch();

  const pageOffset = romPage * pageSize;

  styles['--grid'] = grid;

  let loopClass = 'norm';
  let loopFound = 0;
  let loopFoundExtra = false;

  const {
    contextMenu,
    handleContextMenu: hookHandleContextMenu,
    handleClose: hookHandleClose,
  } = useContextMenu();

  const [contextLocation, setContextLocation] = useState<number | null>(null);

  const handleContextMenu = (ev: MouseEvent, location: number) => {
    setContextLocation(location);
    hookHandleContextMenu(ev);
  };

  const startEdit = () => {
    setEditLocation(contextLocation);
    hookHandleClose();
  };

  const handleClose = () => {
    setEditLocation(null);
    hookHandleClose();
  };

  const setTilemapStart = () => {
    if (contextLocation !== null) {
      setVRAMMapOffset(contextLocation);
    }

    hookHandleClose();
  };

  const setVRAMStart = () => {
    if (contextLocation !== null) {
      setVRAMTilesOffset(contextLocation);
    }

    hookHandleClose();
  };

  return (
    <>
      <div className="render grid__container">
        <div className="grid__col grid__col--12">
          <Stack direction="row" useFlexGap spacing={2} justifyContent="space-between">
            <RenderGridOptions />
            <RomPagination />
          </Stack>
        </div>
      </div>

      <div className="render grid__container">
        <div className="render__grid  grid__col grid__col--12">
          <div
            className={clsx('render__list', {
              'render__list--textgrid': renderTextGrid,
            })}
            style={styles}
          >
            {patchedPage.map((char, index) => {
              if (char.special === MapCharTask.FONT_BOLD) {
                loopClass = 'bold';
              }

              if ((char.special === MapCharTask.FONT_SLIM) ||
                (char.special === MapCharTask.STRING_TERM)) {
                loopClass = 'norm';
              }

              const foundTest = found.findIndex((location) => location === pageOffset + index);
              if (foundTest > -1) {
                loopFound = rawPattern.byteLength;
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
                  handleContextMenu={handleContextMenu}
                />
              );
            })}
          </div>
        </div>
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu || undefined}
        >
          <MenuItem onClick={startEdit}>Edit from here</MenuItem>
          <MenuItem onClick={setTilemapStart}>
            { `Tilemap starts here${vramMapOffset !== null && vramMapOffset !== contextLocation ?
              ` (Will replace location ${hexPad(vramMapOffset, 6)})` :
              ''
            }` }
          </MenuItem>
          <MenuItem onClick={setVRAMStart}>
            { `VRAM starts here${vramTilesOffset !== null && vramTilesOffset !== contextLocation ?
              ` (Will replace location ${hexPad(vramTilesOffset, 6)})` :
              ''
            }` }
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}

export default Render;