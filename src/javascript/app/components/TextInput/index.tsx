import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import usePatternStore from '../../stores/patternStore';
import { useRom } from '../../hooks/useRom';
import { useSearch } from '../../hooks/useSearch';

function TextInput() {
  const { setText, inputTextError, text, rawPattern } = usePatternStore();
  const length = rawPattern.byteLength;

  const { findInRom } = useSearch();

  const { romSize } = useRom();

  return (
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
  );
}

export default TextInput;
