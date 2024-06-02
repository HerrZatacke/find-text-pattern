import React from 'react';
import { AppBar, Toolbar, Button, Stack, ButtonGroup } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import ExploreIcon from '@mui/icons-material/Explore';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import GridOffIcon from '@mui/icons-material/GridOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CodeIcon from '@mui/icons-material/Code';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import useGridStore from '../../stores/gridStore';
import useSettingsStore from '../../stores/settingsStore';
import { useRom } from '../../hooks/useRom';
import { useFile } from '../../hooks/useFile';
import { useSearch } from '../../hooks/useSearch';
import { usePatch } from '../../hooks/usePatch';
import { useRam } from '../../hooks/useRam';
import DropdownMenu from '../MenuControls/DropdownMenu';
import RomPagination from '../MenuControls/RomPagination';

function Settings() {
  const { gridGroups, gridCols, setGridGroups, setGridCols } = useGridStore();

  const {
    charMapVisible: visible,
    setCharMapVisible: setVisible,
    renderTextGrid,
    setRenderTextGrid,
    renderHexChars,
    setRenderHexChars,
    showMap,
    setShowMap,
  } = useSettingsStore();

  const {
    pageSize,
    setPageSize,
  } = useRom();

  const {
    hasROMFile,
    hasVRAMFile,
    onChangeRomFile,
    onChangeRamFile,
    unloadRomFile,
    unloadRamFile,
  } = useFile();

  const {
    foundCount,
    currentFound,
    setCurrentFound,
    clearSearch,
  } = useSearch();

  const { vramTilesOffset } = useRam();

  const { downloadPatchedFile, cleanPatches, patches } = usePatch();

  const patchCount = patches.length;

  const canWorkWithResults = hasROMFile && foundCount > 0;

  return (
    <AppBar
      position="sticky"
      color="secondary"
    >
      <Toolbar>
        <div className="grid__container settings">
          <div className="grid__col grid__col--4">
            <Stack direction="row" spacing={1} useFlexGap justifyContent="start">
              <DropdownMenu
                title="Files"
                entries={[
                  {
                    title: 'Load file',
                    changeHandler: onChangeRomFile,
                    icon: <FolderIcon />,
                  },
                  {
                    title: 'Unload file',
                    clickHandler: unloadRomFile,
                    disabled: !hasROMFile,
                    icon: <FolderOffIcon />,
                  },
                  {},
                  {
                    title: 'Download patched file',
                    clickHandler: downloadPatchedFile,
                    disabled: !hasROMFile,
                    icon: <FileDownloadIcon />,
                  },
                  {
                    title: patchCount ? `Clean ${patchCount} patches` : 'Clean patches',
                    clickHandler: cleanPatches,
                    disabled: !hasROMFile || !patchCount,
                    icon: <CleaningServicesIcon />,
                  },
                  {},
                  {
                    title: 'Load vram content',
                    changeHandler: onChangeRamFile,
                    disabled: !hasROMFile,
                    icon: <FolderSpecialIcon />,
                  },
                  {
                    title: 'Unload vram content',
                    clickHandler: unloadRamFile,
                    disabled: !hasVRAMFile,
                    icon: <FolderSpecialIcon />,
                  },
                ]}
              />
              <DropdownMenu
                title="View"
                entries={[
                  {
                    title: 'Toggle character map',
                    clickHandler: () => setVisible(!visible),
                    icon: visible ? <GridOnIcon /> : <GridOffIcon />,
                  },
                  {
                    title: 'Toggle character type',
                    clickHandler: () => setRenderHexChars(!renderHexChars),
                    icon: renderHexChars ? <CodeIcon /> : <CodeOffIcon />,
                  },
                  {
                    title: 'Toggle grid rendering',
                    clickHandler: () => setRenderTextGrid(!renderTextGrid),
                    icon: renderTextGrid ? <FormatAlignLeftIcon /> : <FormatAlignJustifyIcon />,
                  },
                  {
                    title: 'Toggle tile map',
                    clickHandler: () => setShowMap(!showMap),
                    disabled: vramTilesOffset === 0,
                    icon: showMap ? <ExploreIcon /> : <ExploreOffIcon />,
                  },
                ]}
              />
              <DropdownMenu
                title="Grid"
                entries={[
                  {
                    title: 'Columns',
                    updateHandler: setGridCols,
                    optionsValue: gridCols.toString(10),
                    options: [
                      { title: '8 Columns', value: '8' },
                      { title: '10 Columns', value: '10' },
                      { title: '12 Columns', value: '12' },
                      { title: '14 Columns', value: '14' },
                      { title: '16 Columns', value: '16' },
                      { title: '24 Columns', value: '24' },
                      { title: '32 Columns', value: '32' },
                    ],
                  },
                  {
                    title: 'Groups',
                    updateHandler: setGridGroups,
                    optionsValue: gridGroups.toString(10),
                    options: [
                      { title: '1 Group', value: '1' },
                      { title: '2 Groups', value: '2' },
                      { title: '3 Groups', value: '3' },
                      { title: '4 Groups', value: '4' },
                    ],
                  },
                  {
                    title: 'Page size',
                    updateHandler: (value) => setPageSize(parseInt(value, 10) || 0),
                    optionsValue: pageSize.toString(10),
                    options: [
                      { title: '0x100 (256b)', value: (0x100).toString(10) },
                      { title: '0x200 (512b)', value: (0x200).toString(10) },
                      { title: '0x400 (1kb)', value: (0x400).toString(10) },
                      { title: '0x800 (2kb)', value: (0x800).toString(10) },
                      { title: '0x1000 (4kb)', value: (0x1000).toString(10) },
                      { title: '0x2000 (8kb)', value: (0x2000).toString(10) },
                      { title: '0x4000 (16kb)', value: (0x4000).toString(10) },
                    ],
                  },
                ]}
              />
            </Stack>
          </div>
          <div className="grid__col grid__col--4">
            <ButtonGroup>
              <Button
                title="Go to previous found"
                variant="outlined"
                onClick={() => setCurrentFound(0)}
                disabled={!canWorkWithResults || currentFound === 0}
              >
                <FirstPageIcon />
              </Button>
              <Button
                title="Go to previous found"
                variant="outlined"
                onClick={() => setCurrentFound(currentFound - 1)}
                disabled={!canWorkWithResults || currentFound === 0}
              >
                <NavigateBeforeIcon />
              </Button>
              <Button
                title="Jump to current"
                variant="outlined"
                onClick={() => setCurrentFound(currentFound)}
                disabled={!canWorkWithResults}
              >
                { foundCount && hasROMFile ? `${currentFound + 1}/${foundCount}` : '--' }
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
                disabled={!canWorkWithResults || currentFound + 1 === foundCount}
              >
                <NavigateNextIcon />
              </Button>
              <Button
                title="Go to last found"
                variant="outlined"
                onClick={() => setCurrentFound(foundCount)}
                disabled={!canWorkWithResults || currentFound + 1 === foundCount}
              >
                <LastPageIcon />
              </Button>
            </ButtonGroup>
          </div>
          <div className="grid__col grid__col--4">
            <RomPagination />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Settings;
