import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminArchives from './pages/AdminArchives';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/archives" element={<AdminArchives />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;