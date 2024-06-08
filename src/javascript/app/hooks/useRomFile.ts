import type { ChangeEvent } from 'react';
import { useRom } from './useRom';
import useSearchStore from '../stores/searchStore';
import usePatchStore from '../stores/patchStore';
import useNotificationsStore from '../stores/notificationsStore';
import useRomStore from '../stores/romStore';

interface UseRomFile {
  hasROMFile: boolean,
  unloadRomFile: () => void,
  onChangeRomFile: (ev: ChangeEvent<HTMLInputElement>) => void,
}

export const useRomFile = (): UseRomFile => {
  const {
    setFile: storeSetFile,
    unloadFile: storeUnloadFile,
  } = useRomStore();

  const { romSize } = useRom();

  const { addMessage } = useNotificationsStore();

  const hasROMFile = romSize > 0;

  const {
    setCurrentFound,
    setFound,
  } = useSearchStore();

  const { clearPatches } = usePatchStore();

  const unloadRomFile = () => {
    clearPatches();
    storeUnloadFile();
    setCurrentFound(0);
    setFound([], 0);
  };

  const onChangeRomFile = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;

    if (!target.files || !target.files[0]) {
      return;
    }

    const file = [...target.files].find((searchfile) => (
      searchfile.name.match(/\.(?<extension>gb[c]?$)/gi)
    ));

    if (file) {
      clearPatches();
      storeSetFile(target.files[0]);
      setCurrentFound(0);
      setFound([], 0);
    } else {
      addMessage({ text: 'Invalid file - must be a .gb or .gbc file', type: 'error' });
    }


    target.value = '';
  };

  return {
    hasROMFile,
    onChangeRomFile,
    unloadRomFile,
  };
};
