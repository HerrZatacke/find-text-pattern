import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/components/App';
import { initCopyEventListener } from './tools/initCopyEventListener';
import { initPageNavListener } from './tools/initPageNavListener';
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
});
