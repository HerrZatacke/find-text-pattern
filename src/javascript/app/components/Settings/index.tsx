import React from 'react';
import { AppBar, Toolbar, Button, TextField, MenuItem, Stack, ButtonGroup } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import GridOffIcon from '@mui/icons-material/GridOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import useGridStore from '../../stores/gridStore';
import useSettingsStore from '../../stores/settingsStore';
import useRomStore from '../../stores/romStore';
import { useFile } from '../../hooks/useFile';
import { useSearch } from '../../hooks/useSearch';
import { usePatch } from '../../hooks/usePatch';

export function Settings() {
  const { gridRows, gridCols, setGridRows, setGridCols } = useGridStore((state) => ({
    gridRows: state.gridRows,
    gridCols: state.gridCols,
    setGridRows: state.setGridRows,
    setGridCols: state.setGridCols,
  }));

  const { visible, setVisible, renderTextGrid, setRenderTextGrid } = useSettingsStore((state) => ({
    visible: state.charMapVisible,
    setVisible: state.setCharMapVisible,
    renderTextGrid: state.renderTextGrid,
    setRenderTextGrid: state.setRenderTextGrid,
  }));

  const {
    maxPage,
    pageSize,
    romPage,
    setPageSize,
    setRomPage,
    cleanRomPage,
  } = useRomStore((state) => ({
    maxPage: state.maxPage,
    pageSize: state.pageSize,
    romPage: state.romPage,
    setPageSize: state.setPageSize,
    setRomPage: state.setRomPage,
    cleanRomPage: state.cleanRomPage,
  }));

  const {
    hasFile,
    setFile,
    unloadFile,
  } = useFile();

  const {
    foundCount,
    currentFound,
    setCurrentFound,
    clearSearch,
  } = useSearch();

  const { downloadPatchedFile } = usePatch();

  const canWorkWithResults = hasFile && foundCount > 0;

  return (
    <AppBar
      position="sticky"
      color="secondary"
    >
      <Toolbar>
        <div className="grid__container settings">
          <div className="grid__col grid__col--6">
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                label="Columns"
                title="Columns"
                value={gridCols}
                onChange={({ target }) => setGridCols(target.value)}
                variant="outlined"
                size="small"
                select
              >
                <MenuItem value={8}>8 Columns</MenuItem>
                <MenuItem value={10}>10 Columns</MenuItem>
                <MenuItem value={12}>12 Columns</MenuItem>
                <MenuItem value={14}>14 Columns</MenuItem>
                <MenuItem value={16}>16 Columns</MenuItem>
                <MenuItem value={24}>24 Columns</MenuItem>
                <MenuItem value={32}>32 Columns</MenuItem>
              </TextField>
              <TextField
                label="Rows"
                title="Rows"
                value={gridRows}
                onChange={({ target }) => setGridRows(target.value)}
                variant="outlined"
                size="small"
                select
              >
                <MenuItem value={1}>1 Rows</MenuItem>
                <MenuItem value={2}>2 Rows</MenuItem>
                <MenuItem value={3}>3 Rows</MenuItem>
                <MenuItem value={4}>4 Rows</MenuItem>
              </TextField>
              <TextField
                label={`Page: ${romPage + 1}/${maxPage + 1}`}
                title="Page"
                value={romPage + 1}
                onBlur={cleanRomPage}
                onChange={({ target }) => setRomPage(parseInt(target.value, 10) - 1 || 0)}
                variant="outlined"
                size="small"
                disabled={!hasFile}
                inputProps={{
                  min: 1,
                  max: maxPage + 1,
                  type: 'number',
                }}
              />
              <TextField
                label="Page size"
                title="Page size"
                value={pageSize}
                onChange={({ target }) => setPageSize(parseInt(target.value, 10) || 0)}
                variant="outlined"
                size="small"
                disabled={!hasFile}
                select
              >
                <MenuItem value={0x100}>0x100 (256b)</MenuItem>
                <MenuItem value={0x200}>0x200 (512b)</MenuItem>
                <MenuItem value={0x400}>0x400 (1kb)</MenuItem>
                <MenuItem value={0x800}>0x800 (2kb)</MenuItem>
                <MenuItem value={0x1000}>0x1000 (4kb)</MenuItem>
                <MenuItem value={0x2000}>0x2000 (8kb)</MenuItem>
                <MenuItem value={0x4000}>0x4000 (16kb)</MenuItem>
              </TextField>
            </Stack>
          </div>
          <div className="grid__col grid__col--6">
            <Stack direction="row" spacing={1} useFlexGap justifyContent="end">
              <ButtonGroup>
                <Button
                  title="Go to previous found"
                  variant="outlined"
                  onClick={() => setCurrentFound(currentFound - 1)}
                  disabled={!canWorkWithResults}
                >
                  <ArrowLeftIcon />
                </Button>
                <Button
                  title="Go to current"
                  variant="outlined"
                  onClick={() => setCurrentFound(currentFound)}
                  disabled={!canWorkWithResults}
                >
                  { foundCount && hasFile ? `${currentFound + 1}/${foundCount}` : '--' }
                </Button>
                <Button
                  title="Clear search"
                  variant="outlined"
                  onClick={() => clearSearch()}
                  disabled={!canWorkWithResults}
                >
                  <SearchOffIcon />
                </Button>
                <Button
                  title="Go to next found"
                  variant="outlined"
                  onClick={() => setCurrentFound(currentFound + 1)}
                  disabled={!canWorkWithResults}
                >
                  <ArrowRightIcon />
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  title="Toggle character map"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <GridOnIcon /> : <GridOffIcon />}
                </Button>
                <Button
                  title="Toggle grid rendering"
                  onClick={() => setRenderTextGrid(!renderTextGrid)}
                >
                  {renderTextGrid ? <FormatAlignLeftIcon /> : <FormatAlignJustifyIcon />}
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  title="Download patched file"
                  onClick={downloadPatchedFile}
                  disabled={!hasFile}
                >
                  <FileDownloadIcon />
                </Button>
                <Button
                  title="Unload file"
                  onClick={unloadFile}
                  disabled={!hasFile}
                >
                  <FolderOffIcon />
                </Button>
                <Button
                  title="Load file"
                  component="label"
                >
                  <FolderOpenIcon />
                  <input
                    type="file"
                    hidden
                    onChange={({ target }) => setFile(target.files)}
                  />
                </Button>
              </ButtonGroup>
            </Stack>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
