```tsx
// Update the menuItems array to include the Archives page
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
```