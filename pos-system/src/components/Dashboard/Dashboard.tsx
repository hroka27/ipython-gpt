import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock
} from 'lucide-react';
import { User } from '../../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app this would come from API
  const metrics = {
    today: {
      revenue: 2847.50,
      transactions: 45,
      customers: 38,
      avgBasket: 63.28,
      change: { revenue: 12.5, transactions: 8.3, customers: -2.1, avgBasket: 15.2 }
    },
    week: {
      revenue: 18245.75,
      transactions: 287,
      customers: 234,
      avgBasket: 63.58,
      change: { revenue: 8.2, transactions: 12.1, customers: 5.4, avgBasket: -3.2 }
    },
    month: {
      revenue: 72843.25,
      transactions: 1143,
      customers: 856,
      avgBasket: 63.75,
      change: { revenue: 15.8, transactions: 18.5, customers: 12.3, avgBasket: 4.1 }
    }
  };

  const currentMetrics = metrics[timeframe];

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${currentMetrics.revenue.toLocaleString()}`,
      change: currentMetrics.change.revenue,
      icon: DollarSign,
      color: 'text-green-600 bg-green-50'
    },
    {
      name: 'Transactions',
      value: currentMetrics.transactions.toLocaleString(),
      change: currentMetrics.change.transactions,
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      name: 'Customers',
      value: currentMetrics.customers.toLocaleString(),
      change: currentMetrics.change.customers,
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      name: 'Avg Basket Size',
      value: `$${currentMetrics.avgBasket.toFixed(2)}`,
      change: currentMetrics.change.avgBasket,
      icon: Package,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const recentTransactions = [
    { id: 'TXN-001', customer: 'John Doe', amount: 45.99, time: '2 min ago', status: 'completed' },
    { id: 'TXN-002', customer: 'Jane Smith', amount: 128.50, time: '5 min ago', status: 'completed' },
    { id: 'TXN-003', customer: 'Walk-in', amount: 23.75, time: '8 min ago', status: 'completed' },
    { id: 'TXN-004', customer: 'Mike Johnson', amount: 89.99, time: '12 min ago', status: 'completed' },
    { id: 'TXN-005', customer: 'Sarah Wilson', amount: 156.25, time: '15 min ago', status: 'completed' },
  ];

  const topProducts = [
    { name: 'Premium Coffee Beans', sold: 45, revenue: 675.00 },
    { name: 'Wireless Headphones', sold: 12, revenue: 1440.00 },
    { name: 'Organic Tea Set', sold: 28, revenue: 420.00 },
    { name: 'Bluetooth Speaker', sold: 8, revenue: 800.00 },
    { name: 'Travel Mug', sold: 35, revenue: 525.00 },
  ];

  const lowStockItems = [
    { name: 'Premium Coffee Beans', current: 5, min: 20, status: 'critical' },
    { name: 'Paper Cups (Large)', current: 12, min: 50, status: 'low' },
    { name: 'Espresso Pods', current: 18, min: 30, status: 'low' },
    { name: 'Organic Milk', current: 3, min: 15, status: 'critical' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.first_name}! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['today', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                      timeframe === period
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;
            
            return (
              <div key={stat.name} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last {timeframe}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.id}</p>
                        <p className="text-sm text-gray-500">{transaction.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {transaction.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Products */}
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
              </div>
              <div className="p-6 space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sold} sold</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="card">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
              </div>
              <div className="p-6 space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.current} / {item.min} min
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'critical' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;