/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { MenuItem, Menu, ListItemText, Typography, Button } from '@mui/material';
import { useRandomId } from '../../../../hooks/useRandomId';

export interface MenuEntrySelectOption {
  title: string,
  value: string,
  disabled?: boolean,
}

interface Props {
  title?: string,
  value?: string,
  updateHandler: (value: string) => void,
  options: MenuEntrySelectOption[],
  disabled?: boolean,
  button?: boolean,
  icon?: ReactNode,
}

function SelectEntry({ title, value, updateHandler, options, disabled, button, icon }: Props) {
  const id = useRandomId();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedOption = options.find((option) => option.value === value);

  const menuItemProps = {
    disabled,
    id: `${id}-button`,
    title: selectedOption?.title,
    'aria-controls': open ? `${id}-menu` : undefined,
    'aria-haspopup': true,
    'aria-expanded': open,
    onClick: handleClick,
  };

  return (
    <div>
      { button ? (
        <Button
          {...menuItemProps}
          variant="outlined"
        >
          { icon }
          { icon && '\u00a0' }
          { `${title}\u00a0` }
        </Button>
      ) : (
        <MenuItem {...menuItemProps}>
          <ListItemText sx={{ minWidth: '120px' }}>
            {/* icon might be displayed wrong */}
            { icon }
            { `${title}\u00a0` }
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            { selectedOption?.title }
          </Typography>
        </MenuItem>
      ) }
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
              onClick={() => {
                updateHandler(option.value);
                handleClose();
              }}
              disabled={option.disabled}
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
