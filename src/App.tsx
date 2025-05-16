import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { Events } from './pages/Events';
import { Members } from './pages/Members';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import ConferenceRegistration from './pages/ConferenceRegistration';
import TechConferenceRegistration from './pages/TechConferenceRegistration';
import { AdminConferenceRegistrations } from './pages/AdminConferenceRegistrations';
import { AdminTechConferenceRegistrations } from './pages/AdminTechConferenceRegistrations';
import { AdminConferenceSettings } from './pages/AdminConferenceSettings';
import { AdminTechConferenceSettings } from './pages/AdminTechConferenceSettings';
import { AdminHallOfFameNominations } from './pages/AdminHallOfFameNominations';
import { HallOfFameNomination } from './pages/HallOfFameNomination';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminTestComponent from './components/AdminTestComponent';
import UserDebugComponent from './components/UserDebugComponent';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);

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
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/news" element={<News />} />
              <Route path="/events" element={<Events />} />
              <Route path="/members" element={<Members />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/conference-registration" element={<ConferenceRegistration />} />
              <Route path="/tech-conference-registration" element={<TechConferenceRegistration />} />
              <Route path="/hall-of-fame-nomination" element={<HallOfFameNomination />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/conference-registrations" element={<AdminConferenceRegistrations />} />
              <Route path="/admin/tech-conference-registrations" element={<AdminTechConferenceRegistrations />} />
              <Route path="/admin/conference-settings" element={<AdminConferenceSettings />} />
              <Route path="/admin/tech-conference-settings" element={<AdminTechConferenceSettings />} />
              <Route path="/admin/hall-of-fame-nominations" element={<AdminHallOfFameNominations />} />
              <Route path="/admin/test" element={<AdminTestComponent />} />
              <Route path="/admin/debug" element={<UserDebugComponent />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;