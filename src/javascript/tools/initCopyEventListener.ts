export const initCopyEventListener = () => {
  document.addEventListener('keydown', async (ev) => {
    if (ev.key === 'c' && ev.ctrlKey) {
      try {
        const selection = window?.getSelection();
        if (!selection) {
          return;
        }

        const selectedText = selection.toString()
          .split('\n')
          .join('')
          .split('␣')
          .join(' ');
        await navigator.clipboard.writeText(selectedText);
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  });
};
