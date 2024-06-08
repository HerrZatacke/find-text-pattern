import React, { useState } from 'react';
import { Button, ButtonGroup, IconButton, InputAdornment, Popover, TextField } from '@mui/material';
import RedoIcon from '@mui/icons-material/Redo';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import useRomStore from '../../../stores/romStore';
import { useRandomId } from '../../../hooks/useRandomId';
import { useRom } from '../../../hooks/useRom';

function RomPagination() {
  const {
    maxPage,
    romSize,
  } = useRom();

  const {
    setRomPage,
  } = useRomStore();

  const { romPage } = useRomStore();

  const formId = useRandomId();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formValue, setFormValue] = useState<string>('');

  const showForm = Boolean(anchorEl);

  const hasROMFile = romSize > 0;

  const jumpToPage = () => {
    setRomPage(parseInt(formValue, 10) - 1 || 0);
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonGroup>
        <Button
          title="First page"
          variant="outlined"
          onClick={() => setRomPage(0)}
          disabled={!hasROMFile}
        >
          <FirstPageIcon />
        </Button>
        <Button
          title="Previous page"
          variant="outlined"
          onClick={() => setRomPage(romPage - 1)}
          disabled={!hasROMFile}
        >
          <NavigateBeforeIcon />
        </Button>
        <Button
          id={`button-${formId}`}
          title="Go to page"
          variant="outlined"
          disabled={!hasROMFile}
          aria-controls={showForm ? `menu-${formId}` : undefined}
          aria-haspopup="true"
          aria-expanded={showForm ? 'true' : undefined}
          onClick={(event) => {
            setFormValue((romPage + 1).toString(10));
            setAnchorEl(event.currentTarget);
          }}
        >
          <RedoIcon />
          { `\u00a0${romPage + 1}/${maxPage + 1}` }
        </Button>
        <Button
          title="Next page"
          variant="outlined"
          onClick={() => setRomPage(romPage + 1)}
          disabled={!hasROMFile}
        >
          <NavigateNextIcon />
        </Button>
        <Button
          title="Last page"
          variant="outlined"
          onClick={() => setRomPage(maxPage)}
          disabled={!hasROMFile}
        >
          <LastPageIcon />
        </Button>
      </ButtonGroup>
      <Popover
        id={`menu-${formId}`}
        anchorEl={anchorEl}
        open={showForm}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            'aria-labelledby': `button-${formId}`,
          },
        }}
      >
        <TextField
          placeholder="Page"
          value={formValue}
          onChange={({ target }) => setFormValue(target.value)}
          variant="outlined"
          size="medium"
          fullWidth
          autoFocus
          onFocus={(event) => {
            event.target.select();
          }}
          onKeyUp={(ev) => {
            if (ev.key === 'Enter') {
              jumpToPage();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  color="primary"
                  title="Goto Page"
                  onClick={jumpToPage}
                  disabled={!formValue}
                >
                  <RedoIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Popover>
    </>
  );
}

export default RomPagination;
