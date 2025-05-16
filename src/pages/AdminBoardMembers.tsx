import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, MoveUp, MoveDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface BoardMember {
  id: string;
  name: string;
  title: string;
  district: string | null;
  bio: string | null;
  image: string | null;
  order: number;
}

export const AdminBoardMembers: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [formData, setFormData] = useState<Partial<BoardMember>>({
    name: '',
    title: '',
    district: '',
    bio: '',
    image: '',
    order: 0
  });

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

      fetchMembers();
    } catch (error) {
      console.error('Session check error:', error);
      navigate('/admin/login');
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      setMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching board members:', error);
      setError('Failed to load board members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const id = editingMember ? editingMember.id : uuidv4();
      const { error } = await supabase
        .from('board_members')
        .upsert({
          id,
          ...formData,
          order: formData.order || members.length
        });

      if (error) throw error;

      setSuccess(`Board member ${editingMember ? 'updated' : 'added'} successfully!`);
      setShowForm(false);
      setEditingMember(null);
      setFormData({
        name: '',
        title: '',
        district: '',
        bio: '',
        image: '',
        order: 0
      });
      fetchMembers();
    } catch (error: any) {
      console.error('Error saving board member:', error);
      setError(`Failed to save board member: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board member?')) return;

    try {
      const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Board member deleted successfully!');
      fetchMembers();
    } catch (error: any) {
      console.error('Error deleting board member:', error);
      setError(`Failed to delete board member: ${error.message}`);
    }
  };

  const handleEdit = (member: BoardMember) => {
    setEditingMember(member);
    setFormData(member);
    setShowForm(true);
  };

  const handleMove = async (memberId: string, direction: 'up' | 'down') => {
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (
      (direction === 'up' && memberIndex === 0) ||
      (direction === 'down' && memberIndex === members.length - 1)
    ) {
      return;
    }

    const newMembers = [...members];
    const swapIndex = direction === 'up' ? memberIndex - 1 : memberIndex + 1;
    
    // Swap order values
    const tempOrder = newMembers[memberIndex].order;
    newMembers[memberIndex].order = newMembers[swapIndex].order;
    newMembers[swapIndex].order = tempOrder;

    try {
      const { error } = await supabase
        .from('board_members')
        .upsert([
          newMembers[memberIndex],
          newMembers[swapIndex]
        ]);

      if (error) throw error;

      fetchMembers();
    } catch (error: any) {
      console.error('Error reordering board members:', error);
      setError(`Failed to reorder board members: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Manage Board Members</h1>
          </div>
          <p className="mt-2">Add, edit, or remove board members</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Add Member Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingMember(null);
              setFormData({
                name: '',
                title: '',
                district: '',
                bio: '',
                image: '',
                order: members.length
              });
              setShowForm(!showForm);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Member
          </button>
        </div>

        {/* Add/Edit Member Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-secondary mb-6">
              {editingMember ? 'Edit Board Member' : 'Add New Board Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image Filename
                  </label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="e.g., john-smith.jpg"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Place image files in src/images/board-members/
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMember(null);
                    setFormData({
                      name: '',
                      title: '',
                      district: '',
                      bio: '',
                      image: '',
                      order: 0
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                >
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleMove(member.id, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded hover:bg-gray-100 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove(member.id, 'down')}
                        disabled={index === members.length - 1}
                        className={`p-1 rounded hover:bg-gray-100 ${index === members.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
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
      </div>
    </div>
  );
};

export default AdminBoardMembers;