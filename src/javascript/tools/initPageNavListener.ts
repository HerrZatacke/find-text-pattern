import useRomStore from '../app/stores/romStore';

export const initPageNavListener = () => {
  document.addEventListener('keyup', (ev) => {
    if (
      (ev.target as HTMLElement instanceof HTMLTextAreaElement) ||
      (ev.target as HTMLElement instanceof HTMLSelectElement) ||
      (ev.target as HTMLElement instanceof HTMLInputElement)
    ) {
      return;
    }

    switch (ev.key) {
      case 'ArrowRight': {
        const { romPage, setRomPage } = useRomStore.getState();
        setRomPage(romPage + 1);
        break;
      }

      case 'ArrowLeft': {
        const { romPage, setRomPage } = useRomStore.getState();
        setRomPage(romPage - 1);
        break;
      }

      default:
    }
  });
};
