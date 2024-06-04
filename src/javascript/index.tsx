import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/components/App';
import { initCopyEventListener } from './tools/initCopyEventListener';
import { initPageNavListener } from './tools/initPageNavListener';
import { initRamContentTools } from './tools/zustand/ramContentTools';
import '../scss/index.scss';
import '../scss/grid.scss';

document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  const root = createRoot(appRoot);

  root.render(<App />);

  initCopyEventListener();
  initPageNavListener();

  // Wait until stores have been repopulated from localstorage
  window.setTimeout(() => {
    initRamContentTools();
  }, 100);
});
