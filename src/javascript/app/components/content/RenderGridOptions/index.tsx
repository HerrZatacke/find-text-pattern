import React from 'react';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import ViewColumn from '@mui/icons-material/ViewColumn';
import ViewModule from '@mui/icons-material/ViewModule';
import PhotoSizeSelectSmall from '@mui/icons-material/PhotoSizeSelectSmall';
import Code from '@mui/icons-material/Code';
import ButtonMenu from '../MenuControls/ButtonMenu';
import useGridStore from '../../../stores/gridStore';
import { useRom } from '../../../hooks/useRom';
import { useRam } from '../../../hooks/useRam';
import useSettingsStore, { CharRender } from '../../../stores/settingsStore';

function RenderGridOptions() {
  const { gridGroups, gridCols, setGridGroups, setGridCols } = useGridStore();
  const { renderTextGrid, setRenderTextGrid, charStyle, setCharStyle } = useSettingsStore();
  const { pageSize, setPageSize } = useRom();
  const { vramTilesOffset, vramMapOffset } = useRam();

  return (
    <ButtonMenu
      entries={[
        {
          title: 'Columns',
          updateHandler: setGridCols,
          optionsValue: gridCols.toString(10),
          icon: <ViewModule />,
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
          icon: <ViewColumn />,
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
          icon: <PhotoSizeSelectSmall />,
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
        {
          title: 'Character style',
          updateHandler: (value) => setCharStyle(value as CharRender),
          optionsValue: charStyle,
          icon: <Code />,
          options: [
            { title: 'Character Map', value: CharRender.CHAR_MAP },
            { title: 'Hexadecimal', value: CharRender.HEX },
            { title: 'Tile Map', value: CharRender.TILE_MAP, disabled: vramTilesOffset === null || vramMapOffset === null },
          ],
        },
        {
          title: 'Grid style',
          clickHandler: () => setRenderTextGrid(!renderTextGrid),
          icon: renderTextGrid ? <FormatAlignLeft /> : <FormatAlignJustify />,
        },
      ]}
    />
  );
}

export default RenderGridOptions;
