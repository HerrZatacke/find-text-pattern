import React from 'react';
import { Stack } from '@mui/material';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import { useRomFile } from '../../../hooks/useRomFile';
import { useRamFile } from '../../../hooks/useRamFile';
import { usePatch } from '../../../hooks/usePatch';
import DropdownMenu from '../MenuControls/DropdownMenu';

function Menus() {
  const {
    hasROMFile,
    onChangeRomFile,
    unloadRomFile,
  } = useRomFile();

  const { onChangeRamFile } = useRamFile();

  const { downloadPatchedFile, cleanPatches, patches } = usePatch();

  const patchCount = patches.length;

  return (
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
        ]}
      />
    </Stack>
  );
}

export default Menus;
