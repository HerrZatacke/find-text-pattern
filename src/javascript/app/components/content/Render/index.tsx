import React, { useState } from 'react';
import { clsx } from 'clsx';
import type { CSSPropertiesVars, MouseEvent } from 'react';
import { Menu, MenuItem, Stack } from '@mui/material';
import { MapCharTask } from '../../../../../types/MapChar';
import useGridStore from '../../../stores/gridStore';
import useSettingsStore from '../../../stores/settingsStore';
import useRomStore from '../../../stores/romStore';
import useTileMapsStore from '../../../stores/tileMapsStore';
import RenderChar from '../RenderChar';
import type { FoundInfo } from '../RenderChar';
import RomPagination from '../RomPagination';
import RenderGridOptions from '../RenderGridOptions';
import { useSearch } from '../../../hooks/useSearch';
import { usePatch } from '../../../hooks/usePatch';
import { useContextMenu } from '../../../hooks/useContextMenu';
import { useRomListeners } from '../../../hooks/useRomListeners';
import { hexPad } from '../../../../tools/hexPad';
import { useDataContext } from '../../../hooks/useDataContext';
import { useTileMap } from '../../../hooks/useTileMap';

import './index.scss';

function Render() {
  const styles: CSSPropertiesVars = {};

  const { renderTextGrid, charStyle } = useSettingsStore();

  const { grid } = useGridStore();

  const { updateTileMap } = useTileMapsStore();
  const { activeMapItem } = useTileMap();

  useRomListeners();

  const {
    pageSize,
    romPage,
  } = useRomStore();

  const { tilesOffset, mapOffset } = useTileMap();

  const { found, currentFound, searchLength } = useSearch();
  const { setEditLocation } = usePatch();
  const { patchedPage } = useDataContext();

  const pageOffset = romPage * pageSize;

  styles['--grid'] = grid;

  let loopClass = 'norm';

  const loopFound: FoundInfo = {
    isFound: false,
    isCurrentFound: false,
    foundIndex: searchLength,
    currentFoundIndex: searchLength,
  };

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
    if (contextLocation !== null && activeMapItem) {
      const internalMapping = Array(32 * 32)
        .fill('')
        .map((_, index: number) => (
          contextLocation + index
        ));

      updateTileMap({
        ...activeMapItem,
        internalMapping,
      });
    }

    hookHandleClose();
  };

  const setVRAMStart = () => {
    if (contextLocation !== null && activeMapItem) {
      updateTileMap({
        ...activeMapItem,
        vramOffset: contextLocation,
      });
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

              const foundIndex = found.findIndex((location) => location === pageOffset + index);

              if (foundIndex > -1) {
                loopFound.isFound = true;
                loopFound.foundIndex = 0;

                if (foundIndex === currentFound) {
                  loopFound.isCurrentFound = true;
                  loopFound.currentFoundIndex = 0;
                }
              }

              if (loopFound.currentFoundIndex === searchLength) {
                loopFound.isCurrentFound = false;
              }

              if (loopFound.foundIndex === searchLength) {
                loopFound.isFound = false;
              }

              loopFound.currentFoundIndex = Math.min(loopFound.currentFoundIndex + 1, searchLength);
              loopFound.foundIndex = Math.min(loopFound.foundIndex + 1, searchLength);

              return (
                <RenderChar
                  key={pageOffset + index}
                  found={{ ...loopFound }}
                  globalOffset={pageOffset + index}
                  pageOffset={index}
                  char={char}
                  charStyle={charStyle}
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
            { `Tilemap starts here${mapOffset !== null && mapOffset !== contextLocation ?
              ` (Will replace location ${hexPad(mapOffset, 6)})` :
              ''
            }` }
          </MenuItem>

          <MenuItem onClick={setVRAMStart}>
            { `VRAM starts here${tilesOffset !== null && tilesOffset !== contextLocation ?
              ` (Will replace location ${hexPad(tilesOffset, 6)})` :
              ''
            }` }
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}

export default Render;
