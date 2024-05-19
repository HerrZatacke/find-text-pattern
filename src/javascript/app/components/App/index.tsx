import React, { useEffect, useMemo, useRef } from 'react';
import chunk from 'chunk';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
import { Stack } from '@mui/material';
import { Decoder } from 'gb-image-decoder';
import CharMap from '../CharMap';
import TextInput from '../TextInput';
import HexInput from '../HexInput';
import Render from '../Render';
import PatchEdit from '../PatchEdit';
import Settings from '../Settings';

import './index.scss';
import { usePatch } from '../../hooks/usePatch';
import { hexPadSimple } from '../../../tools/hexPad';

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
  const canvas = useRef<HTMLCanvasElement>(null);
  const { patchedPageArray } = usePatch();
  const decoder = useMemo<Decoder>(() => (new Decoder()), []);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const tiles = [...chunk(patchedPageArray, 16)]
      .map((tile: number[]) => (
        [...tile].map((byte: number) => (
          hexPadSimple(byte, 2)
        )).join('')
      ));

    decoder.update({
      canvas: canvas.current,
      tiles,
      palette: ['#dddddd', '#999999', '#666666', '#222222'],
      invertPalette: false,
      lockFrame: false,
    });
  }, [patchedPageArray, decoder, canvas]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Settings />

        <div className="grid__container">
          <div className="grid__col grid__col--1" />
          <div className="grid__col grid__col--8">
            <Stack direction="column" spacing={4}>
              <TextInput />
              <HexInput />
            </Stack>
          </div>
          <div className="grid__col grid__col--3">
            <canvas ref={canvas} />
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
