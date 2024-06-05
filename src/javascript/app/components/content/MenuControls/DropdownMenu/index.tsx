import React, { useState } from 'react';
import { Button, Menu, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useRandomId } from '../../../../hooks/useRandomId';
import DefaultEntry from '../DefaultEntry';
import SelectEntry from '../SelectEntry';
import FileEntry from '../FileEntry';
import type { MenuEntry } from '../../../../../../types/Menus';

interface Props {
  title: string,
  entries: MenuEntry[],
}

function DropdownMenu({ title, entries }: Props) {
  const id = useRandomId();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={`${id}-button`}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size="large"
      >
        { title }
      </Button>
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
          entries.map(({
            title: entryTitle,
            disabled,
            icon,
            clickHandler,
            changeHandler,
            updateHandler,
            options,
            optionsValue,
          }, index) => {
            const menuContent = (
              <>
                { Boolean(icon) && (
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                )}
                { Boolean(entryTitle) && (
                  <ListItemText>
                    {entryTitle}
                  </ListItemText>
                )}
              </>
            );

            if (clickHandler) {
              return (
                <DefaultEntry
                  key={index}
                  disabled={disabled}
                  clickHandler={() => {
                    clickHandler();
                    handleClose();
                  }}
                  content={menuContent}
                />
              );
            }

            if (updateHandler && options?.length) {
              return (
                <SelectEntry
                  key={index}
                  title={entryTitle}
                  value={optionsValue}
                  updateHandler={(value: string) => {
                    updateHandler(value);
                    handleClose();
                  }}
                  options={options}
                />
              );
            }

            if (changeHandler) {
              return (
                <FileEntry
                  key={entryTitle}
                  disabled={disabled}
                  changeHandler={(ev) => {
                    changeHandler(ev);
                    handleClose();
                  }}
                  content={menuContent}
                />
              );
            }

            return <Divider key={index} />;
          })
        }
      </Menu>
    </div>
  );
}

export default DropdownMenu;
