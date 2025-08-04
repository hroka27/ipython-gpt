import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone, Receipt, Calculator } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPayment: (payments: PaymentMethod[]) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, onPayment }) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'digital_wallet' | 'split'>('cash');
  const [cashAmount, setCashAmount] = useState(total.toString());
  const [cardAmount, setCardAmount] = useState('');
  const [digitalAmount, setDigitalAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: DollarSign, color: 'bg-green-500' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'digital_wallet', name: 'Digital Wallet', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'split', name: 'Split Payment', icon: Calculator, color: 'bg-orange-500' },
  ];

  const calculateChange = () => {
    if (selectedMethod === 'cash') {
      const cash = parseFloat(cashAmount) || 0;
      return Math.max(0, cash - total);
    }
    return 0;
  };

  const getSplitTotal = () => {
    const cash = parseFloat(cashAmount) || 0;
    const card = parseFloat(cardAmount) || 0;
    const digital = parseFloat(digitalAmount) || 0;
    return cash + card + digital;
  };

  const isValidPayment = () => {
    if (selectedMethod === 'cash') {
      const cash = parseFloat(cashAmount) || 0;
      return cash >= total;
    } else if (selectedMethod === 'split') {
      return Math.abs(getSplitTotal() - total) < 0.01;
    } else {
      return true; // For card and digital payments, assume external validation
    }
  };

  const handlePayment = async () => {
    if (!isValidPayment()) {
      alert('Invalid payment amount');
      return;
    }

    setLoading(true);

    const payments: PaymentMethod[] = [];

    if (selectedMethod === 'cash') {
      payments.push({
        type: 'cash',
        amount: total,
      });
    } else if (selectedMethod === 'card') {
      payments.push({
        type: 'card',
        amount: total,
        card_last_four: '1234', // This would come from card reader
        transaction_id: `TXN-${Date.now()}`,
        approval_code: 'APPROVED',
      });
    } else if (selectedMethod === 'digital_wallet') {
      payments.push({
        type: 'digital_wallet',
        amount: total,
        transaction_id: `DW-${Date.now()}`,
        approval_code: 'APPROVED',
      });
    } else if (selectedMethod === 'split') {
      if (parseFloat(cashAmount) > 0) {
        payments.push({
          type: 'cash',
          amount: parseFloat(cashAmount),
        });
      }
      if (parseFloat(cardAmount) > 0) {
        payments.push({
          type: 'card',
          amount: parseFloat(cardAmount),
          card_last_four: '1234',
          transaction_id: `TXN-${Date.now()}`,
          approval_code: 'APPROVED',
        });
      }
      if (parseFloat(digitalAmount) > 0) {
        payments.push({
          type: 'digital_wallet',
          amount: parseFloat(digitalAmount),
          transaction_id: `DW-${Date.now()}`,
          approval_code: 'APPROVED',
        });
      }
    }

    try {
      await onPayment(payments);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickCashAmounts = [
    { label: 'Exact', amount: total },
    { label: '$5', amount: Math.ceil(total / 5) * 5 },
    { label: '$10', amount: Math.ceil(total / 10) * 10 },
    { label: '$20', amount: Math.ceil(total / 20) * 20 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Total Amount */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-primary-600">${total.toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${method.color} flex items-center justify-center mb-2 mx-auto`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{method.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cash Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter cash amount"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Amounts</p>
                <div className="flex flex-wrap gap-2">
                  {quickCashAmounts.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setCashAmount(item.amount.toFixed(2))}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {item.label}: ${item.amount.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Calculation */}
              {parseFloat(cashAmount) > total && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Change Due:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${calculateChange().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Please insert, swipe, or tap card on terminal
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Amount: ${total.toFixed(2)}
              </p>
            </div>
          )}

          {selectedMethod === 'digital_wallet' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Customer can pay with Apple Pay, Google Pay, or other digital wallet
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Amount: ${total.toFixed(2)}
              </p>
            </div>
          )}

          {selectedMethod === 'split' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cash Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Digital Wallet
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={digitalAmount}
                    onChange={(e) => setDigitalAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              {/* Split Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Split Total:</span>
                    <span className={getSplitTotal() === total ? 'text-green-600' : 'text-red-600'}>
                      ${getSplitTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Difference:</span>
                    <span className={Math.abs(getSplitTotal() - total) < 0.01 ? 'text-green-600' : 'text-red-600'}>
                      ${(getSplitTotal() - total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!isValidPayment() || loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Receipt className="w-4 h-4" />
            )}
            <span>{loading ? 'Processing...' : 'Complete Payment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;