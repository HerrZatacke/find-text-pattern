import React from 'react';
import type { ReactNode } from 'react';
import { MenuItem } from '@mui/material';

interface Props {
  disabled?: boolean,
  clickHandler: () => void,
  content: ReactNode,
}

function DefaultEntry({ disabled, clickHandler, content }: Props) {
  return (
    <MenuItem
      disabled={disabled}
      onClick={clickHandler}
    >
      { content }
    </MenuItem>
  );
}

export default DefaultEntry;
