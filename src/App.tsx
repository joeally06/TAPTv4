import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminArchives from './pages/AdminArchives';

function App() {
  return (
    <Routes>
      <Route path="/admin/archives" element={<AdminArchives />} />
    </Routes>
  );
}

export default App;