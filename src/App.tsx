import React from 'react';
import { Route } from 'react-router-dom';
import AdminArchives from './pages/AdminArchives';

function App() {
  return (
    <Route path="/admin/archives" element={<AdminArchives />} />
  );
}

export default App;