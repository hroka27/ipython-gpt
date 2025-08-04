import React, { useState, useEffect } from 'react';
import { X, Search, Plus, User, Phone, Mail, Star } from 'lucide-react';
import { Customer } from '../../types';
import { db } from '../../lib/supabase';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectCustomer, 
  selectedCustomer 
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
    }
  }, [isOpen]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await db.getCustomers();
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadCustomers();
      return;
    }

    // Filter customers locally for now
    // In a real app, you'd want server-side search
    const filtered = customers.filter(customer =>
      customer.first_name.toLowerCase().includes(query.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email?.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone?.includes(query)
    );
    setCustomers(filtered);
  };

  const handleCreateCustomer = async () => {
    try {
      setLoading(true);
      const customer = await db.createCustomer({
        ...newCustomer,
        loyalty_points: 0,
        loyalty_tier: 'bronze',
        total_spent: 0,
      });
      
      setCustomers(prev => [customer, ...prev]);
      setNewCustomer({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
      });
      setShowNewCustomerForm(false);
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error creating customer');
    } finally {
      setLoading(false);
    }
  };

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-600 bg-orange-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'platinum': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Select Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => searchCustomers(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowNewCustomerForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Customer</span>
            </button>
          </div>

          {/* Current Selection */}
          {selectedCustomer && (
            <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-900">
                    Current: {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </p>
                  <p className="text-xs text-primary-600">
                    {selectedCustomer.loyalty_points} points • {selectedCustomer.loyalty_tier}
                  </p>
                </div>
                <button
                  onClick={() => onSelectCustomer(null)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Customer Form */}
        {showNewCustomerForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.first_name}
                  onChange={(e) => setNewCustomer(prev => ({...prev, first_name: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomer.last_name}
                  onChange={(e) => setNewCustomer(prev => ({...prev, last_name: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({...prev, address: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer(prev => ({...prev, city: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newCustomer.state}
                    onChange={(e) => setNewCustomer(prev => ({...prev, state: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={newCustomer.zip_code}
                    onChange={(e) => setNewCustomer(prev => ({...prev, zip_code: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowNewCustomerForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                disabled={!newCustomer.first_name || !newCustomer.last_name || loading}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
          </div>
        )}

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <User className="w-12 h-12 mb-2" />
              <p className="font-medium">No customers found</p>
              <p className="text-sm">Try adjusting your search or add a new customer</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    onSelectCustomer(customer);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {customer.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{customer.email}</span>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {customer.loyalty_points} pts
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getLoyaltyTierColor(customer.loyalty_tier)}`}>
                          {customer.loyalty_tier}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Total spent: ${customer.total_spent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onSelectCustomer(null);
              onClose();
            }}
            className="btn-secondary"
          >
            Continue Without Customer
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;