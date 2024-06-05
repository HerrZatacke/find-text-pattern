import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import usePatternStore from '../../../stores/patternStore';
import { useSearch } from '../../../hooks/useSearch';
import { useRom } from '../../../hooks/useRom';
import Visual from '../Visual';
import SearchPagination from '../SearchPagination';

function SearchBlock() {
  const {
    text,
    hex,
    inputTextError,
    inputHexError,
    setText,
    setHex,
    cleanHex,
    rawPattern,
  } = usePatternStore();
  const length = rawPattern.byteLength;

  const { findInRom } = useSearch();

  const { romSize } = useRom();

  return (
    <>
      <div className="grid__container">
        <div className="grid__col grid__col--8">
          <TextField
            id="textInput"
            label="Text"
            value={text}
            onChange={({ target }) => setText(target.value)}
            variant="outlined"
            size="small"
            fullWidth
            error={!!inputTextError}
            helperText={inputTextError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    color="primary"
                    title="Search"
                    onClick={findInRom}
                    disabled={!!inputTextError || !romSize || !length}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="grid__col grid__col--4 grid__col--content-end">
          <SearchPagination />
        </div>
      </div>
      <div className="grid__container">
        <div className="grid__col grid__col--8 grid__col--content-end">
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
        <div className="grid__col grid__col--4 grid__col--content-end">
          <Visual />
        </div>
      </div>
    </>
  );
}

export default SearchBlock;
