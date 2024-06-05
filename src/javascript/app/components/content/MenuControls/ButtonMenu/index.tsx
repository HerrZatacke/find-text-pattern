import React from 'react';
import { ButtonGroup } from '@mui/material';
import type { MenuEntry } from '../../../../../../types/Menus';
import DefaultEntry from '../DefaultEntry';
import SelectEntry from '../SelectEntry';
import FileEntry from '../FileEntry';

interface Props {
  entries: MenuEntry[],
}
function ButtonMenu({ entries }: Props) {
  return (
    <ButtonGroup>
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
              { icon }
              { icon && '\u00a0' }
              { entryTitle }
            </>
          );

          if (clickHandler) {
            return (
              <DefaultEntry
                key={index}
                disabled={disabled}
                clickHandler={clickHandler}
                content={menuContent}
                button
              />
            );
          }

          if (updateHandler && options?.length) {
            return (
              <SelectEntry
                key={index}
                title={entryTitle}
                value={optionsValue}
                updateHandler={updateHandler}
                options={options}
                icon={icon}
                button
              />
            );
          }

          if (changeHandler) {
            return (
              <FileEntry
                key={entryTitle}
                disabled={disabled}
                changeHandler={changeHandler}
                content={menuContent}
              />
            );
          }

          return null;
        })
      }
    </ButtonGroup>
  );
}

export default ButtonMenu;
