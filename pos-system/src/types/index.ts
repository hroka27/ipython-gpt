// Database Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  category_id: string;
  supplier_id?: string;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  is_active: boolean;
  image_url?: string;
  weight?: number;
  dimensions?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  loyalty_points: number;
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  customer_id?: string;
  cashier_id: string;
  store_id: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'active' | 'voided' | 'returned';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
  created_at: string;
}

export interface PaymentMethod {
  type: 'cash' | 'card' | 'digital_wallet' | 'store_credit';
  amount: number;
  card_last_four?: string;
  transaction_id?: string;
  approval_code?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  manager_id: string;
  is_active: boolean;
  business_hours: BusinessHours;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'cashier' | 'staff';
  store_id?: string;
  is_active: boolean;
  permissions: Permission[];
  pin_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  terms: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  store_id: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  expected_delivery: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_cost: number;
}

export interface InventoryLog {
  id: string;
  product_id: string;
  store_id: string;
  type: 'adjustment' | 'shrinkage' | 'spoilage' | 'transfer' | 'sale' | 'purchase';
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reason?: string;
  reference_id?: string;
  created_by: string;
  created_at: string;
}

// UI Types
export interface CartItem {
  product: Product;
  quantity: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

export interface PosState {
  cart: CartItem[];
  customer?: Customer;
  payments: PaymentMethod[];
  discounts: Discount[];
  tax_rate: number;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;
  conditions?: any;
  requires_manager_approval: boolean;
  is_active: boolean;
}

export interface SalesReport {
  period: string;
  total_sales: number;
  total_transactions: number;
  average_basket_size: number;
  top_products: Array<{
    product: Product;
    quantity_sold: number;
    revenue: number;
  }>;
  hourly_sales: Array<{
    hour: number;
    sales: number;
    transactions: number;
  }>;
  daily_sales: Array<{
    date: string;
    sales: number;
    transactions: number;
  }>;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  points_per_dollar: number;
  redemption_rate: number; // points per dollar off
  tiers: LoyaltyTier[];
  is_active: boolean;
}

export interface LoyaltyTier {
  name: string;
  min_points: number;
  benefits: string[];
  discount_percentage: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  target_audience: {
    loyalty_tiers?: string[];
    purchase_history?: any;
    location?: string[];
    custom_tags?: string[];
  };
  content: {
    subject?: string;
    message: string;
    image_url?: string;
  };
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  created_at: string;
  updated_at: string;
}