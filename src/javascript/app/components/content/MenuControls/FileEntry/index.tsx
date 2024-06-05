import type { ChangeEvent, ReactNode } from 'react';
import React from 'react';
import { MenuItem } from '@mui/material';

interface Props {
  disabled?: boolean,
  changeHandler: (ev: ChangeEvent<HTMLInputElement>) => void,
  content: ReactNode,
}

function FileEntry({ disabled, changeHandler, content }: Props) {
  return (
    <MenuItem
      disabled={disabled}
      component="label"
    >
      <input
        type="file"
        hidden
        onChange={changeHandler}
      />
      { content }
    </MenuItem>
  );
}

export default FileEntry;
