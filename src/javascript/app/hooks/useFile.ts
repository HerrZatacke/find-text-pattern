import type { ChangeEvent } from 'react';
import useRomStore from '../stores/romStore';
import useSearchStore from '../stores/searchStore';
import usePatchStore from '../stores/patchStore';
import useRamStore from '../stores/ramStore';

interface UseFile {
  hasFile: boolean,
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
    setRamFile: storeSetRamFile,
    unloadFile: unloadRamFile,
  } = useRamStore();

  const hasFile = romSize > 0;

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
    unloadRamFile();

    target.value = '';
  };

  const onChangeRamFile = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;

    if (!target.files || !target.files[0]) {
      return;
    }

    storeSetRamFile(target.files[0]);

    target.value = '';
  };

  return {
    hasFile,
    onChangeRomFile,
    onChangeRamFile,
    unloadRomFile,
    unloadRamFile,
  };
};
