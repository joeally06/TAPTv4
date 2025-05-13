import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Search, Filter, ChevronDown, ChevronUp, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ConferenceRegistration {
  id: string;
  school_district: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_attendees: number;
  total_amount: number;
  created_at: string;
  attendees?: Attendee[];
}

export const AdminConferenceRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ConferenceRegistration>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRegistration, setSelectedRegistration] = useState<ConferenceRegistration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Verify admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;

      if (!userData || userData.role !== 'admin') {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      fetchRegistrations();
    } catch (error: any) {
      console.error('Session check error:', error);
      navigate('/admin/login');
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('conference_registrations')
        .select(`
          *,
          attendees:conference_attendees(*)
        `)
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;

      console.log('Fetched registrations:', data);
      setRegistrations(data || []);
    } catch (error: any) {
      console.error('Error fetching registrations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof ConferenceRegistration) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRegistrations = registrations.filter(registration => {
    const searchString = searchTerm.toLowerCase();
    return (
      registration.school_district.toLowerCase().includes(searchString) ||
      registration.first_name.toLowerCase().includes(searchString) ||
      registration.last_name.toLowerCase().includes(searchString) ||
      registration.email.toLowerCase().includes(searchString)
    );
  });

  const exportToCSV = () => {
    const headers = [
      'School District',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Total Attendees',
      'Total Amount',
      'Registration Date'
    ];

    const csvData = filteredRegistrations.map(reg => [
      reg.school_district,
      reg.first_name,
      reg.last_name,
      reg.email,
      reg.phone,
      reg.total_attendees,
      reg.total_amount,
      new Date(reg.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conference_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ field }: { field: keyof ConferenceRegistration }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Conference Registrations</h1>
          <p className="mt-2">Manage and track conference registrations</p>
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
          
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Download className="h-5 w-5 mr-2" />
            Export to CSV
          </button>
        </div>

        {/* Registrations Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading registrations...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error loading registrations: {error}</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'school_district', label: 'School District' },
                      { key: 'first_name', label: 'First Name' },
                      { key: 'last_name', label: 'Last Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'total_attendees', label: 'Attendees' },
                      { key: 'total_amount', label: 'Amount' },
                      { key: 'created_at', label: 'Registration Date' }
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort(key as keyof ConferenceRegistration)}
                      >
                        <div className="flex items-center">
                          {label}
                          <SortIcon field={key as keyof ConferenceRegistration} />
                        </div>
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registration.school_district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {registration.total_attendees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${registration.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setShowDetailsModal(true);
                          }}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {/* Handle edit */}}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {/* Handle delete */}}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-secondary">Registration Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">School District</h4>
                  <p className="mt-1">{selectedRegistration.school_district}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Registration Date</h4>
                  <p className="mt-1">{new Date(selectedRegistration.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Primary Contact</h4>
                  <p className="mt-1">{selectedRegistration.first_name} {selectedRegistration.last_name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Email</h4>
                  <p className="mt-1">{selectedRegistration.email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Phone</h4>
                  <p className="mt-1">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Total Amount</h4>
                  <p className="mt-1">${selectedRegistration.total_amount.toFixed(2)}</p>
                </div>
              </div>

              {/* Additional Attendees */}
              {selectedRegistration.attendees && selectedRegistration.attendees.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-500 mb-3">Additional Attendees</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedRegistration.attendees.map((attendee, index) => (
                          <tr key={attendee.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {attendee.first_name} {attendee.last_name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {attendee.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};