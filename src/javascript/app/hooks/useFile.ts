import useRomStore from '../stores/romStore';
import useSearchStore from '../stores/searchStore';

interface UseFile {
  hasFile: boolean,
  unloadFile: () => void,
  setFile: (files: FileList | null) => void,
}

export const useFile = (): UseFile => {
  const {
    hasFile,
    setFile: storeSetFile,
    unloadFile: storeUnloadFile,
  } = useRomStore((state) => ({
    hasFile: state.romSize > 0,
    setFile: state.setFile,
    unloadFile: state.unloadFile,
  }));

  const {
    setCurrentFound,
    setFound,
  } = useSearchStore((state) => ({
    found: state.found,
    currentFound: state.currentFound,
    setCurrentFound: state.setCurrentFound,
    setFound: state.setFound,
  }));

  const unloadFile = () => {
    storeUnloadFile();
    setCurrentFound(0);
    setFound([]);
  };

  const setFile = (files: FileList | null) => {
    if (!files || !files[0]) {
      return;
    }

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
