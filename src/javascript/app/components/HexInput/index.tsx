import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import usePatternStore from '../../stores/patternStore';
import useRomStore from '../../stores/romStore';
import { useSearch } from '../../hooks/useSearch';

function HexInput() {
  const { setHex, inputHexError, hex, cleanHex, length } = usePatternStore((state) => ({
    setHex: state.setHex,
    inputHexError: state.inputHexError,
    hex: state.hex,
    cleanHex: state.cleanHex,
    length: state.rawPattern.length,
  }));

  const { findInRom } = useSearch();

  const romSize = useRomStore((store) => (store.romSize));

  return (
    <div className="grid__container">
      <div className="grid__col grid__col--12">
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
      </div>
    </div>
  );
}

export default HexInput;
