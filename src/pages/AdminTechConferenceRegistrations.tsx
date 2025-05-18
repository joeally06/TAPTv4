import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Download, Search, ChevronDown, ChevronUp, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
import ArchiveViewerModal from '../components/ArchiveViewerModal';

interface TechConferenceAttendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface TechConferenceRegistration {
  id: string;
  school_district: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_attendees: number;
  total_amount: number;
  created_at: string;
  attendees?: TechConferenceAttendee[];
}

const AdminTechConferenceRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<TechConferenceRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof TechConferenceRegistration>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRegistration, setSelectedRegistration] = useState<TechConferenceRegistration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // ... rest of your existing code ...

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/admin')}
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Tech Conference Registrations</h1>
          </div>
          <p className="mt-2">Manage and track tech conference registrations</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowArchiveModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              View Archives
            </button>

            <button
              onClick={handleClearTable}
              disabled={clearing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {clearing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Clear All
                </>
              )}
            </button>

            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Download className="h-5 w-5 mr-2" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* ... rest of your existing JSX ... */}

        <ArchiveViewerModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          type="tech-conference"
        />
      </div>
    </div>
  );
};

export default AdminTechConferenceRegistrations;