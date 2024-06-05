import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout';
import RomView from '../RomView';
import TileMap from '../TileMap';
import CharMap from '../CharMap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="romview" element={<RomView />} />
        <Route path="tilemap" element={<TileMap />} />
        <Route path="charmap" element={<CharMap />} />
        <Route index element={<Navigate to="/romview" />} />
        <Route path="*" element={<Navigate to="/romview" />} />
      </Route>
    </Routes>
  );
}

export default App;
