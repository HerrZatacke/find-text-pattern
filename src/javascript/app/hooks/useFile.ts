import useRomStore from '../stores/romStore';
import useSearchStore from '../stores/searchStore';
import usePatchStore from '../stores/patchStore';

interface UseFile {
  hasFile: boolean,
  unloadFile: () => void,
  setFile: (files: FileList | null) => void,
}

export const useFile = (): UseFile => {
  const {
    romSize,
    setFile: storeSetFile,
    unloadFile: storeUnloadFile,
  } = useRomStore();

  const hasFile = romSize > 0;

  const {
    setCurrentFound,
    setFound,
  } = useSearchStore();

  const { clearPatches } = usePatchStore();

  const unloadFile = () => {
    clearPatches();
    storeUnloadFile();
    setCurrentFound(0);
    setFound([]);
  };

  const setFile = (files: FileList | null) => {
    if (!files || !files[0]) {
      return;
    }

    clearPatches();
    storeSetFile(files[0]);
    setCurrentFound(0);
    setFound([]);
  };

  return {
    hasFile,
    setFile,
    unloadFile,
  };
};
