import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { useRomFile } from '../../../hooks/useRomFile';
import { useSearch } from '../../../hooks/useSearch';

function SearchPagination() {
  const {
    hasROMFile,
  } = useRomFile();

  const {
    foundCount,
    currentFound,
    setCurrentFound,
    clearSearch,
  } = useSearch();

  const canWorkWithResults = hasROMFile && foundCount > 0;

  return (
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
  );
}

export default SearchPagination;
