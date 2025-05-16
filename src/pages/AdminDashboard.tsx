import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SupabaseConnectionTest from '../components/SupabaseConnectionTest';
import {
  Settings,
  Users,
  Calendar,
  Award,
  FileText,
  Bell,
  LogOut
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    conferenceRegistrations: 0,
    techConferenceRegistrations: 0,
    nominations: 0
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      const isAdmin = await checkAdminStatus();
      if (isAdmin) {
        await fetchDashboardStats();
      }
    };

    initializeDashboard();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        navigate('/admin/login');
        return false;
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
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session check error:', error);
      navigate('/admin/login');
      return false;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Get conference registration stats
      const { count: conferenceCount, error: confError } = await supabase
        .from('conference_registrations')
        .select('*', { count: 'exact', head: true });

      if (confError) throw confError;

      // Get tech conference registration stats
      const { count: techConfCount, error: techConfError } = await supabase
        .from('tech_conference_registrations')
        .select('*', { count: 'exact', head: true });

      if (techConfError) throw techConfError;

      // Get nomination stats
      const { count: nominationsCount, error: nomError } = await supabase
        .from('hall_of_fame_nominations')
        .select('*', { count: 'exact', head: true });

      if (nomError) throw nomError;

      setStats({
        conferenceRegistrations: conferenceCount || 0,
        techConferenceRegistrations: techConfCount || 0,
        nominations: nominationsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics. Please verify your admin privileges.');
      
      if (error instanceof Error && error.message.includes('Authentication')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const adminModules = [
    {
      title: 'Conference Settings',
      description: 'Configure conference details and registration options',
      icon: <Settings className="h-6 w-6" />,
      link: '/admin/conference-settings',
      color: 'bg-blue-500'
    },
    {
      title: 'Tech Conference Settings',
      description: 'Configure tech conference details and registration options',
      icon: <Settings className="h-6 w-6" />,
      link: '/admin/tech-conference-settings',
      color: 'bg-purple-500'
    },
    {
      title: 'Hall of Fame Settings',
      description: 'Configure Hall of Fame nomination period and requirements',
      icon: <Settings className="h-6 w-6" />,
      link: '/admin/hall-of-fame-settings',
      color: 'bg-green-500'
    },
    {
      title: 'Conference Registrations',
      description: 'View and manage conference registrations',
      icon: <Calendar className="h-6 w-6" />,
      link: '/admin/conference-registrations',
      color: 'bg-orange-500'
    },
    {
      title: 'Tech Conference Registrations',
      description: 'View and manage tech conference registrations',
      icon: <Calendar className="h-6 w-6" />,
      link: '/admin/tech-conference-registrations',
      color: 'bg-indigo-500'
    },
    {
      title: 'Hall of Fame Nominations',
      description: 'Review and manage Hall of Fame nominations',
      icon: <Award className="h-6 w-6" />,
      link: '/admin/hall-of-fame-nominations',
      color: 'bg-yellow-500'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <Users className="h-6 w-6" />,
      link: '/admin/users',
      color: 'bg-red-500'
    },
    {
      title: 'Content Management',
      description: 'Update website content and resources',
      icon: <FileText className="h-6 w-6" />,
      link: '/admin/content',
      color: 'bg-teal-500'
    },
    {
      title: 'Notifications',
      description: 'Manage system notifications and alerts',
      icon: <Bell className="h-6 w-6" />,
      link: '/admin/notifications',
      color: 'bg-pink-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supabase Connection Test */}
        <SupabaseConnectionTest />

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Conference Registrations
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.conferenceRegistrations}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Tech Conference Registrations
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.techConferenceRegistrations}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Hall of Fame Nominations
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.nominations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <Link
              key={index}
              to={module.link}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${module.color}`}>
                    {module.icon}
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};