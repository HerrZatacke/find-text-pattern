import React from 'react';
import type { ReactNode } from 'react';
import { Button, MenuItem } from '@mui/material';

interface Props {
  disabled?: boolean,
  clickHandler: () => void,
  content: ReactNode,
  button?: boolean,
  icon?: ReactNode
}

function DefaultEntry({ disabled, clickHandler, content, button, icon }: Props) {
  return (
    button ? (
      <Button
        disabled={disabled}
        onClick={clickHandler}
      >
        { content }
      </Button>
    ) : (
      <MenuItem
        disabled={disabled}
        onClick={clickHandler}
      >
        { icon }
        { content }
      </MenuItem>
    )
  );
}

export default DefaultEntry;
