import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User } from './types';

// Components
import Layout from './components/Layout';
import Login from './components/Login';
import POSInterface from './components/POS/POSInterface';
import Dashboard from './components/Dashboard/Dashboard';
import Inventory from './components/Inventory/Inventory';
import Reports from './components/Reports/Reports';
import Customers from './components/Customers/Customers';
import Settings from './components/Settings/Settings';
import StaffManagement from './components/Staff/StaffManagement';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        // Fetch user profile with role and permissions
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // In development mode, use mock users
      if (process.env.NODE_ENV === 'development') {
        const { mockUsers } = await import('./lib/mockData');
        const userData = mockUsers.find(user => user.id === userId);
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          permissions:user_permissions(
            permission:permissions(*)
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          {/* POS Interface - Primary route for cashiers */}
          <Route path="/pos" element={<POSInterface user={user} />} />
          
          {/* Management Dashboard */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          
          {/* Inventory Management */}
          <Route path="/inventory" element={<Inventory user={user} />} />
          
          {/* Reports and Analytics */}
          <Route path="/reports" element={<Reports user={user} />} />
          
          {/* Customer Management */}
          <Route path="/customers" element={<Customers user={user} />} />
          
          {/* Staff Management */}
          <Route path="/staff" element={<StaffManagement user={user} />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings user={user} />} />
          
          {/* Default route based on user role */}
          <Route path="/" element={
            <Navigate to={
              user.role === 'cashier' ? '/pos' : '/dashboard'
            } replace />
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
