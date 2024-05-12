import React from 'react';
import './index.scss';
import CharMap from '../CharMap';
import TextInput from '../TextInput';
import HexInput from '../HexInput';
import Render from '../Render';
import { Settings } from '../Settings';

function App() {
  return (
    <div className="app">
      <TextInput />
      <HexInput />
      <CharMap />
      <Settings />
      <Render />
    </div>
  );
}

export default App;
