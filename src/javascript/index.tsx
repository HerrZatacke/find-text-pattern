import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
import App from './app/components/structure/App';
import { initRamContentTools } from './tools/zustand/ramContentTools';

import '../scss/index.scss';
import '../scss/grid.scss';

document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }

  const root = createRoot(appRoot);

  const theme = createTheme({
    palette: {
      primary: lightBlue,
      secondary: {
        main: '#eee',
        light: '#fff',
        dark: '#ccc',
        contrastText: '#666',
      },
    },
  });

  root.render(
    <React.StrictMode>
      <HashRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </HashRouter>
    </React.StrictMode>,
  );
  // Wait until stores have been repopulated from localstorage
  window.setTimeout(() => {
    initRamContentTools();
  }, 100);
});
