import React, { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Menu,
  X,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Leads Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200
          shadow-[2px_0_8px_rgba(0,0,0,0.04)]
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center h-16 border-b border-gray-100 px-4 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 flex-shrink-0">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-gray-900 truncate leading-tight">
                Smart Leads
              </h1>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">
                Dashboard
              </p>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto p-1 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}`
              }
              onClick={() => setMobileSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          {/* Collapse Toggle (desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-full p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* User Card + Logout */}
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold flex-shrink-0 uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-gray-500 truncate">{user?.role || 'User'}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Logout"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {/* Left: Mobile Menu + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'User'}</span>
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage and track your leads pipeline
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group">
              <Bell className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-[11px] text-gray-500">{user?.role || 'User'}</p>
              </div>
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <UserIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
