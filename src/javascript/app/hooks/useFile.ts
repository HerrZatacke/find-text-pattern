import type { ChangeEvent } from 'react';
import useRomStore from '../stores/romStore';
import useSearchStore from '../stores/searchStore';
import usePatchStore from '../stores/patchStore';
import useRamStore from '../stores/ramStore';
import useNotificationsStore from '../stores/notificationsStore';

interface UseFile {
  hasROMFile: boolean,
  hasVRAMFile: boolean,
  unloadRomFile: () => void,
  unloadRamFile: () => void,
  onChangeRamFile: (ev: ChangeEvent<HTMLInputElement>) => void,
  onChangeRomFile: (ev: ChangeEvent<HTMLInputElement>) => void,
}

export const useFile = (): UseFile => {
  const {
    romSize,
    setFile: storeSetFile,
    unloadFile: storeUnloadFile,
  } = useRomStore();


  const {
    vramSize,
    setRamFile: storeSetRamFile,
    unloadFile: unloadRamFile,
  } = useRamStore();

  const { addMessage } = useNotificationsStore();

  const hasROMFile = romSize > 0;
  const hasVRAMFile = vramSize > 0;

  const {
    setCurrentFound,
    setFound,
  } = useSearchStore();

  const { clearPatches } = usePatchStore();

  const unloadRomFile = () => {
    clearPatches();
    storeUnloadFile();
    setCurrentFound(0);
    setFound([]);
    unloadRamFile();
  };

  const onChangeRomFile = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;

    if (!target.files || !target.files[0]) {
      return;
    }

    clearPatches();
    storeSetFile(target.files[0]);
    setCurrentFound(0);
    setFound([]);

    target.value = '';
  };

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
    hasROMFile,
    hasVRAMFile,
    onChangeRomFile,
    onChangeRamFile,
    unloadRomFile,
    unloadRamFile,
  };
};
