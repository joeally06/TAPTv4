import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { Events } from './pages/Events';
import { Members } from './pages/Members';
import { ConferenceRegistration } from './pages/ConferenceRegistration';
import { HallOfFameNomination } from './pages/HallOfFameNomination';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import SupabaseConnectionTest from './components/SupabaseConnectionTest';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Loading TAPT...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <button 
            onClick={() => setShowConnectionTest(!showConnectionTest)}
            className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-md z-50"
          >
            {showConnectionTest ? 'Hide' : 'Test'} Supabase Connection
          </button>
          
          {showConnectionTest && <SupabaseConnectionTest />}
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/news" element={<News />} />
            <Route path="/events" element={<Events />} />
            <Route path="/members" element={<Members />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/conference-registration" element={<ConferenceRegistration />} />
            <Route path="/hall-of-fame-nomination" element={<HallOfFameNomination />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;