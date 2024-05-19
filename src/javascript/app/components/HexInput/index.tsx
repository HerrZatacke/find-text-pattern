import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import usePatternStore from '../../stores/patternStore';
import useRomStore from '../../stores/romStore';
import { useSearch } from '../../hooks/useSearch';

function HexInput() {
  const { setHex, inputHexError, hex, cleanHex, rawPattern } = usePatternStore();
  const length = rawPattern.length;

  const { findInRom } = useSearch();

  const { romSize } = useRomStore();

  return (
    <TextField
      id="hexInput"
      label="Hex Text"
      value={hex}
      onBlur={cleanHex}
      onChange={({ target }) => setHex(target.value)}
      variant="outlined"
      size="small"
      fullWidth
      multiline
      minRows={4}
      maxRows={4}
      error={!!inputHexError}
      helperText={inputHexError}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              color="primary"
              title="Search"
              onClick={findInRom}
              disabled={!!inputHexError || !romSize || !length}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default HexInput;
