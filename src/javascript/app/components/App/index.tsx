import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
import CharMap from '../CharMap';
import TextInput from '../TextInput';
import HexInput from '../HexInput';
import Render from '../Render';
import { Settings } from '../Settings';

import './index.scss';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Settings />
        <TextInput />
        <HexInput />
        <CharMap />
        <Render />
      </div>
    </ThemeProvider>
  );
}

export default App;
