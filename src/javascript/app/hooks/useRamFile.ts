import type { ChangeEvent } from 'react';
import { useRam } from './useRam';
import useNotificationsStore from '../stores/notificationsStore';

interface UseRamFile {
  hasVRAMFile: boolean,
  unloadRamFile: () => void,
  onChangeRamFile: (ev: ChangeEvent<HTMLInputElement>) => void,
}

export const useRamFile = (): UseRamFile => {
  const {
    vramSize,
    setRamFile: storeSetRamFile,
    unloadFile: unloadRamFile,
  } = useRam();

  const { addMessage } = useNotificationsStore();

  const hasVRAMFile = vramSize > 0;

  const onChangeRamFile = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;

    if (!target.files) {
      return;
    }

    const file = [...target.files].find((searchfile) => (
      searchfile.name.match(/\.(?<extension>sn[0-9]{1}$)/gi)
    ));

    if (file) {
      storeSetRamFile(target.files[0]);
    } else {
      addMessage('Invalid file - must be a .snX gamestate from BGB emulator.');
    }

    target.value = '';
  };

  return {
    hasVRAMFile,
    onChangeRamFile,
    unloadRamFile,
  };
};
