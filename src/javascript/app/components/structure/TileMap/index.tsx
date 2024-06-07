import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemButton, Stack } from '@mui/material';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import Delete from '@mui/icons-material/Delete';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Edit from '@mui/icons-material/Edit';
import TilesDisplay from '../../content/TilesDisplay';
import Visual from '../../content/Visual';
import { useDataContext } from '../../../hooks/useDataContext';
import useRomStore from '../../../stores/romStore';
import useTileMapsStore from '../../../stores/tileMapsStore';
import { hexPad } from '../../../../tools/hexPad';
import { useTileMap } from '../../../hooks/useTileMap';

function Tilemap() {

  const { gotoLocation } = useRomStore();
  const { tileMapTiles } = useDataContext();

  const navigateTo = useNavigate();

  const {
    tileMaps,
    activeMap,
    setActiveMap,
    deleteTileMap,
    addTileMap,
    updateTileMap,
  } = useTileMapsStore();

  const { downloadTileMaps } = useTileMap();

  const goto = (location: number) => {
    navigateTo('/romview');
    gotoLocation(location);
  };

  return (
    <div className="grid__container">
      <div className="grid__col grid__col--6">
        <TilesDisplay
          tiles={tileMapTiles}
          tilesPerLine={32}
        />
      </div>
      <div className="grid__col grid__col--6">
        <Stack direction="column" useFlexGap spacing={4}>
          <Visual showVRAM />
          <Button
            variant="contained"
            onClick={downloadTileMaps}
          >
            Download TileMaps
          </Button>
          <List>
            { tileMaps.map((tileMap) => (
              <ListItem key={tileMap.id} title={tileMap.id}>
                <ListItemButton
                  onClick={() => setActiveMap(tileMap.id)}
                >
                  {activeMap === tileMap.id ? (<Star />) : (<StarBorder />)}
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    // eslint-disable-next-line no-restricted-globals,no-alert
                    if (confirm(`Delete TileMap "${tileMap.title || tileMap.id}"?`)) {
                      deleteTileMap(tileMap.id);
                    }
                  }}
                >
                  <Delete />
                </ListItemButton>
                <ListItemButton
                  onClick={() => addTileMap({
                    title: `Copy of ${tileMap.title}`,
                    width: tileMap.width,
                    height: tileMap.height,
                    internalMapping: [...tileMap.internalMapping],
                    vramOffset: tileMap.vramOffset,
                  })}
                >
                  <ContentCopy />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    // eslint-disable-next-line no-restricted-globals,no-alert
                    const title = prompt('New Title', tileMap.title);

                    if (title) {
                      updateTileMap({
                        ...tileMap,
                        title,
                      });
                    }
                  }}
                >
                  <Edit />
                </ListItemButton>
                <p>
                  { tileMap.title }
                </p>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => goto(tileMap.internalMapping[0])}
                >
                  {`Tilemap ${hexPad(tileMap.internalMapping[0], 6)}`}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => goto(tileMap.vramOffset)}
                >
                  {`VRAM ${hexPad(tileMap.vramOffset, 6)}`}
                </Button>
              </ListItem>
            ))}
          </List>
        </Stack>
      </div>
    </div>
  );
}

export default Tilemap;
