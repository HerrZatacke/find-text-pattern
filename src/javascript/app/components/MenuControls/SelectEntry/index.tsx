import React, { useState } from 'react';
import { MenuItem, Menu, ListItemText, Typography } from '@mui/material';
import { useRandomId } from '../../../hooks/useRandomId';

export interface MenuEntrySelectOption {
  title: string,
  value: string,
}

interface Props {
  title?: string,
  value?: string,
  updateHandler: (value: string) => void,
  options: MenuEntrySelectOption[],
  disabled?: boolean
}

function SelectEntry({ title, value, updateHandler, options, disabled }: Props) {
  const id = useRandomId();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div>
      <MenuItem
        disabled={disabled}
        id={`${id}-button`}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ListItemText sx={{ minWidth: '120px' }}>
          { `${title}\u00a0` }
        </ListItemText>
        <Typography variant="body2" color="text.secondary">
          { selectedOption?.title }
        </Typography>
      </MenuItem>
      <Menu
        id={`${id}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `${id}-button`,
        }}
      >
        {
          options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => updateHandler(option.value)}
            >
              { option.title}
            </MenuItem>
          ))
        }
      </Menu>
    </div>
  );
}

export default SelectEntry;
