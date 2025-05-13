import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, Filter, ChevronDown, ChevronUp, Edit, Trash2, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface HallOfFameNomination {
  id: string;
  supervisor_first_name: string;
  supervisor_last_name: string;
  supervisor_email: string;
  nominee_first_name: string;
  nominee_last_name: string;
  nominee_city: string;
  district: string;
  region: string;
  nomination_reason: string;
  is_tapt_member: boolean;
  years_of_service: number;
  status: string;
  created_at: string;
}

export const AdminHallOfFameNominations: React.FC = () => {
  const navigate = useNavigate();
  const [nominations, setNominations] = useState<HallOfFameNomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof HallOfFameNomination>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedNomination, setSelectedNomination] = useState<HallOfFameNomination | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

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

      fetchNominations();
    } catch (error) {
      console.error('Session check error:', error);
      navigate('/admin/login');
    }
  };

  const fetchNominations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('hall_of_fame_nominations')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;

      setNominations(data || []);
    } catch (error: any) {
      console.error('Error fetching nominations:', error);
      setError('Failed to load nominations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof HallOfFameNomination) => {
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

  const handleStatusChange = async (nominationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('hall_of_fame_nominations')
        .update({ status: newStatus })
        .eq('id', nominationId);

      if (error) throw error;

      fetchNominations();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (nominationId: string) => {
    if (!confirm('Are you sure you want to delete this nomination?')) return;

    try {
      const { error } = await supabase
        .from('hall_of_fame_nominations')
        .delete()
        .eq('id', nominationId);

      if (error) throw error;

      fetchNominations();
    } catch (error: any) {
      console.error('Error deleting nomination:', error);
      alert('Failed to delete nomination. Please try again.');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    const maxLineWidth = pageWidth - 2 * margin;
    
    // Add title
    doc.setFontSize(18);
    doc.text('Hall of Fame Nominations', margin, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 30);

    // Define the columns for the summary table
    const columns = [
      'Nominee',
      'District',
      'Region',
      'Years',
      'Status'
    ];

    // Prepare the summary data
    const data = filteredNominations.map(nomination => [
      `${nomination.nominee_first_name} ${nomination.nominee_last_name}`,
      nomination.district,
      nomination.region,
      nomination.years_of_service.toString(),
      nomination.status
    ]);

    // Add the summary table
    (doc as any).autoTable({
      head: [columns],
      body: data,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [71, 32, 183], // Primary color
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 247]
      }
    });

    // Add detailed nominations with reasons
    let yPos = (doc as any).lastAutoTable.finalY + 20;

    doc.setFontSize(14);
    doc.text('Detailed Nominations', margin, yPos);
    yPos += 10;

    filteredNominations.forEach((nomination, index) => {
      // Check if we need a new page
      if (yPos > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPos = 20;
      }

      // Add nomination details
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${nomination.nominee_first_name} ${nomination.nominee_last_name}`, margin, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`District: ${nomination.district}`, margin, yPos);
      yPos += 5;
      doc.text(`Region: ${nomination.region}`, margin, yPos);
      yPos += 5;
      doc.text(`Years of Service: ${nomination.years_of_service}`, margin, yPos);
      yPos += 5;
      doc.text(`Status: ${nomination.status}`, margin, yPos);
      yPos += 5;
      doc.text(`TAPT Member: ${nomination.is_tapt_member ? 'Yes' : 'No'}`, margin, yPos);
      yPos += 7;

      // Add nomination reason with word wrap
      doc.setFont(undefined, 'bold');
      doc.text('Nomination Reason:', margin, yPos);
      yPos += 7;
      doc.setFont(undefined, 'normal');

      const splitReason = doc.splitTextToSize(nomination.nomination_reason, maxLineWidth);
      doc.text(splitReason, margin, yPos);
      yPos += splitReason.length * 5 + 10;

      // Add nominator info
      doc.setFont(undefined, 'italic');
      doc.text(`Nominated by: ${nomination.supervisor_first_name} ${nomination.supervisor_last_name}`, margin, yPos);
      yPos += 5;
      doc.text(`Email: ${nomination.supervisor_email}`, margin, yPos);
      yPos += 15;
    });

    // Save the PDF
    doc.save(`hall-of-fame-nominations-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredNominations = nominations.filter(nomination => {
    const searchString = searchTerm.toLowerCase();
    return (
      nomination.nominee_first_name.toLowerCase().includes(searchString) ||
      nomination.nominee_last_name.toLowerCase().includes(searchString) ||
      nomination.district.toLowerCase().includes(searchString) ||
      nomination.supervisor_first_name.toLowerCase().includes(searchString) ||
      nomination.supervisor_last_name.toLowerCase().includes(searchString)
    );
  });

  const SortIcon = ({ field }: { field: keyof HallOfFameNomination }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

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
            <h1 className="text-3xl font-bold">Hall of Fame Nominations</h1>
          </div>
          <p className="mt-2">Manage and review Hall of Fame nominations</p>
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
              placeholder="Search nominations..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Download className="h-5 w-5 mr-2" />
            Export to PDF
          </button>
        </div>

        {/* Nominations Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading nominations...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error loading nominations: {error}</p>
            </div>
          ) : filteredNominations.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No nominations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'nominee_last_name', label: 'Nominee' },
                      { key: 'district', label: 'District' },
                      { key: 'region', label: 'Region' },
                      { key: 'years_of_service', label: 'Years of Service' },
                      { key: 'is_tapt_member', label: 'TAPT Member' },
                      { key: 'status', label: 'Status' },
                      { key: 'created_at', label: 'Nomination Date' }
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort(key as keyof HallOfFameNomination)}
                      >
                        <div className="flex items-center">
                          {label}
                          <SortIcon field={key as keyof HallOfFameNomination} />
                        </div>
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNominations.map((nomination) => (
                    <tr key={nomination.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {nomination.nominee_first_name} {nomination.nominee_last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {nomination.nominee_city}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nomination.district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nomination.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nomination.years_of_service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          nomination.is_tapt_member
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {nomination.is_tapt_member ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={nomination.status}
                          onChange={(e) => handleStatusChange(nomination.id, e.target.value)}
                          className="text-sm rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(nomination.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedNomination(nomination);
                            setShowDetailsModal(true);
                          }}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(nomination.id)}
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
        {showDetailsModal && selectedNomination && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-secondary">Nomination Details</h3>
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
                  <h4 className="font-medium text-gray-500">Nominee</h4>
                  <p className="mt-1">{selectedNomination.nominee_first_name} {selectedNomination.nominee_last_name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">District</h4>
                  <p className="mt-1">{selectedNomination.district}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Region</h4>
                  <p className="mt-1">{selectedNomination.region}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Years of Service</h4>
                  <p className="mt-1">{selectedNomination.years_of_service}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">TAPT Member</h4>
                  <p className="mt-1">{selectedNomination.is_tapt_member ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Status</h4>
                  <p className="mt-1">{selectedNomination.status}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-500">Nomination Reason</h4>
                <p className="mt-1 text-gray-700">{selectedNomination.nomination_reason}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-500">Nominated By</h4>
                <div className="mt-2 bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedNomination.supervisor_first_name} {selectedNomination.supervisor_last_name}</p>
                  <p className="text-gray-600">{selectedNomination.supervisor_email}</p>
                </div>
              </div>

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