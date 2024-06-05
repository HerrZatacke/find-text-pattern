import type { ChangeEvent, ReactNode } from 'react';
import type { MenuEntrySelectOption } from '../javascript/app/components/content/MenuControls/SelectEntry';

interface MenuEntryBase {
  title?: string,
  clickHandler?: () => void,
  changeHandler?: (ev: ChangeEvent<HTMLInputElement>) => void,
  updateHandler?: (value: string) => void,
  disabled?: boolean,
  icon?: ReactNode,
  options?: MenuEntrySelectOption[],
  optionsValue?: string,
}

interface MenuEntryDefault extends MenuEntryBase {
  clickHandler: () => void,
}

interface MenuEntryFile extends MenuEntryBase {
  changeHandler: (ev: ChangeEvent<HTMLInputElement>) => void,
}

interface MenuEntrySelect extends MenuEntryBase {
  options: MenuEntrySelectOption[],
  updateHandler: (ev: string) => void,
}

export type MenuEntry = MenuEntryDefault | MenuEntryFile | MenuEntrySelect | MenuEntryBase;
