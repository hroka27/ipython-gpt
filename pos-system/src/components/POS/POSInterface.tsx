import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard,
  DollarSign,
  Smartphone,
  Receipt,
  RotateCcw,
  Settings
} from 'lucide-react';
import { User as UserType, Product, CartItem, Customer, PaymentMethod } from '../../types';
import { db } from '../../lib/supabase';
import ProductSearch from './ProductSearch';
import Cart from './Cart';
import PaymentModal from './PaymentModal';
import CustomerModal from './CustomerModal';

interface POSInterfaceProps {
  user: UserType;
}

const POSInterface: React.FC<POSInterfaceProps> = ({ user }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taxRate] = useState(0.08); // 8% tax rate

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await db.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadProducts();
      return;
    }

    try {
      const data = await db.searchProducts(query);
      setProducts(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const discount = item.discount 
        ? item.discount.type === 'percentage' 
          ? (item.product.price * item.discount.value) / 100
          : item.discount.value
        : 0;
      return sum + ((item.product.price - discount) * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = async (payments: PaymentMethod[]) => {
    try {
      setLoading(true);

      // Generate transaction number
      const transactionNumber = `TXN-${Date.now()}`;

      // Create transaction
      const transaction = await db.createTransaction({
        transaction_number: transactionNumber,
        customer_id: selectedCustomer?.id,
        cashier_id: user.id,
        store_id: user.store_id,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        discount_amount: 0,
        total_amount: calculateTotal(),
        payment_method: payments[0], // For simplicity, using first payment method
        payment_status: 'completed',
        status: 'active'
      });

      // Create transaction items
      const transactionItems = cart.map(item => ({
        transaction_id: transaction.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        discount_amount: item.discount ? 
          (item.discount.type === 'percentage' 
            ? (item.product.price * item.discount.value) / 100
            : item.discount.value) : 0,
        total_price: item.product.price * item.quantity
      }));

      await db.createTransactionItems(transactionItems);

      // Update inventory
      for (const item of cart) {
        const newQuantity = item.product.stock_quantity - item.quantity;
        await db.updateProductStock(item.product.id, newQuantity);
        
        // Log inventory change
        await db.createInventoryLog({
          product_id: item.product.id,
          store_id: user.store_id,
          type: 'sale',
          quantity_change: -item.quantity,
          previous_quantity: item.product.stock_quantity,
          new_quantity: newQuantity,
          reference_id: transaction.id,
          created_by: user.id
        });
      }

      // Update customer loyalty points if customer selected
      if (selectedCustomer) {
        const pointsEarned = Math.floor(calculateTotal());
        // Update customer points logic would go here
      }

      // Clear cart and close modal
      clearCart();
      setShowPaymentModal(false);

      // Show success message or print receipt
      alert(`Transaction completed! Receipt #${transactionNumber}`);

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Panel - Product Search and Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Point of Sale</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Cashier: {user.first_name} {user.last_name}
              </span>
              <button className="btn-secondary">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or barcode..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchProducts(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock_quantity > 10 
                        ? 'bg-green-100 text-green-800'
                        : product.stock_quantity > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Stock: {product.stock_quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Cart and Checkout */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <div className="flex items-center space-x-2">
              <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Customer</span>
            <button
              onClick={() => setShowCustomerModal(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {selectedCustomer ? 'Change' : 'Add Customer'}
            </button>
          </div>
          {selectedCustomer ? (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </p>
              <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
              <p className="text-xs text-primary-600">
                Loyalty Points: {selectedCustomer.loyalty_points}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Walk-in customer</p>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-gray-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary and Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-300 pt-2">
                <span>Total</span>
                <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full btn-primary flex items-center justify-center space-x-2"
                disabled={loading}
              >
                <CreditCard className="w-5 h-5" />
                <span>Checkout</span>
              </button>
              
              <div className="flex space-x-2">
                <button className="flex-1 btn-secondary flex items-center justify-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Hold</span>
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center space-x-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>Return</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          total={calculateTotal()}
          onPayment={handlePayment}
        />
      )}

      {showCustomerModal && (
        <CustomerModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSelectCustomer={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default POSInterface;