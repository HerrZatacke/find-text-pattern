import { useState } from 'react';
import type { MouseEvent } from 'react';

interface ContextLocation {
  top: number;
  left: number;
}

interface UseContextMenu {
  contextMenu: ContextLocation| null,
  handleContextMenu: (event: MouseEvent) => void,
  handleClose: () => void,
}

export const useContextMenu = (): UseContextMenu => {
  const [contextMenu, setContextMenu] = useState<ContextLocation | null>(null);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      top: event.clientY - 6,
      left: event.clientX + 2,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return {
    contextMenu,
    handleContextMenu,
    handleClose,
  };
};
