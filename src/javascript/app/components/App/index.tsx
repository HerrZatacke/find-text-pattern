import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
import { Stack } from '@mui/material';
import CharMap from '../CharMap';
import TextInput from '../TextInput';
import HexInput from '../HexInput';
import Render from '../Render';
import PatchEdit from '../PatchEdit';
import Settings from '../Settings';
import Visual from '../Visual';

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

        <div className="grid__container">
          <div className="grid__col grid__col--7">
            <Stack direction="column" spacing={4}>
              <TextInput />
              <HexInput />
            </Stack>
          </div>
          <div className="grid__col grid__col--5">
            <Visual />
          </div>
        </div>
        <CharMap />
        <Render />
        <PatchEdit />
      </div>
    </ThemeProvider>
  );
}

export default App;
