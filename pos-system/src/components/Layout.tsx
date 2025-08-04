import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  BarChart3, 
  Package, 
  FileText, 
  Users, 
  UserCog, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Store
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'POS', href: '/pos', icon: ShoppingCart, roles: ['cashier', 'manager', 'admin'] },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['manager', 'admin'] },
    { name: 'Inventory', href: '/inventory', icon: Package, roles: ['staff', 'manager', 'admin'] },
    { name: 'Reports', href: '/reports', icon: FileText, roles: ['manager', 'admin'] },
    { name: 'Customers', href: '/customers', icon: Users, roles: ['cashier', 'staff', 'manager', 'admin'] },
    { name: 'Staff', href: '/staff', icon: UserCog, roles: ['manager', 'admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  ].filter(item => item.roles.includes(user.role));

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-full max-w-xs bg-white">
          <div className="absolute top-0 right-0 p-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 px-4 py-6">
            <div className="flex items-center mb-8">
              <Store className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">RetailPOS</span>
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
            <div className="flex items-center px-4 mb-8">
              <Store className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">RetailPOS</span>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-between flex-1 px-4">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">RetailPOS</span>
            </div>
            <div className="text-sm text-gray-600">
              {user.first_name} {user.last_name}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;