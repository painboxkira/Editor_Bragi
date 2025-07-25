import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Scenario from './Menu/Scenar';
import SceneEditor from './Menu/sceneEditor';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scenario />} />
        <Route path="/sceneEditor" element={<SceneEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
