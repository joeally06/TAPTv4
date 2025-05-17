import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Calendar,
  Award,
  LogOut,
  Menu,
  X,
  Archive
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      submenu: [
        { name: 'Conference', path: '/admin/conference-settings' },
        { name: 'Tech Conference', path: '/admin/tech-conference-settings' },
        { name: 'Hall of Fame', path: '/admin/hall-of-fame-settings' }
      ]
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users'
    },
    {
      name: 'Content',
      icon: FileText,
      path: '/admin/content',
      submenu: [
        { name: 'News & Events', path: '/admin/content' },
        { name: 'Board Members', path: '/admin/board-members' },
        { name: 'Resources', path: '/admin/resources' }
      ]
    },
    {
      name: 'Registrations',
      icon: Calendar,
      path: '/admin/registrations',
      submenu: [
        { name: 'Conference', path: '/admin/conference-registrations' },
        { name: 'Tech Conference', path: '/admin/tech-conference-registrations' }
      ]
    },
    {
      name: 'Hall of Fame',
      icon: Award,
      path: '/admin/hall-of-fame',
      submenu: [
        { name: 'Members', path: '/admin/hall-of-fame-members' },
        { name: 'Nominations', path: '/admin/hall-of-fame-nominations' }
      ]
    },
    {
      name: 'Archives',
      icon: Archive,
      path: '/admin/archives'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-secondary">
          <div className="mb-8 px-2">
            <h1 className="text-2xl font-bold text-white">TAPT Admin</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-2 py-2 text-base font-medium rounded-lg ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-primary/20 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>

                {item.submenu && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                          location.pathname === subItem.path
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-primary/20 hover:text-white'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-300 rounded-lg hover:bg-primary/20 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;