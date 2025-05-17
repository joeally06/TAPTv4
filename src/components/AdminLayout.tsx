import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Calendar,
  Award,
  Archive,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

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

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isSubmenuActive = (submenuItems: { path: string }[]) => {
    return submenuItems.some(item => location.pathname === item.path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-white shadow-md`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-8 px-4">
            <h1 className="text-2xl font-bold text-gray-800">TAPT Admin</h1>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                        isSubmenuActive(item.submenu)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openMenus.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openMenus.includes(item.name) && (
                      <div className="mt-1 pl-11 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-4 py-2 text-sm rounded-lg ${
                              isActive(subItem.path)
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg mb-1 ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:ml-64 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;