import { useEffect } from 'react';
import useSettingsStore, { CharRender } from '../stores/settingsStore';
import useRomStore from '../stores/romStore';

export const useRomListeners = () => {
  const { charStyle } = useSettingsStore();
  const { romPage, setRomPage } = useRomStore();

  const copyListener = async (ev: KeyboardEvent) => {
    if (ev.key === 'c' && ev.ctrlKey) {
      try {
        const selection = window?.getSelection();
        if (!selection) {
          return;
        }

        const joinChar = charStyle !== CharRender.CHAR_MAP ? ' ' : '';

        const selectedText = selection.toString()
          .split('\n')
          .join(joinChar)
          .split('␣')
          .join(' ');
        await navigator.clipboard.writeText(selectedText);
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  };

  const pageNavListener = (ev: KeyboardEvent) => {
    if (
      (ev.target as HTMLElement instanceof HTMLTextAreaElement) ||
      (ev.target as HTMLElement instanceof HTMLSelectElement) ||
      (ev.target as HTMLElement instanceof HTMLInputElement)
    ) {
      return;
    }

    switch (ev.key) {
      case 'ArrowRight': {
        setRomPage(romPage + 1);
        break;
      }

      case 'ArrowLeft': {
        setRomPage(romPage - 1);
        break;
      }

      default:
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', copyListener);
    document.addEventListener('keyup', pageNavListener);

    return () => {
      document.removeEventListener('keydown', copyListener);
      document.removeEventListener('keyup', pageNavListener);
    };
  });
};
