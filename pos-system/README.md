# RetailPOS - Complete Point of Sale System

A modern, comprehensive Point of Sale (POS) system built with React, TypeScript, Tailwind CSS, and Supabase. This system includes all the essential features for retail management including POS interface, inventory management, customer management, sales reporting, and more.

## 🚀 Features

### 1. Point of Sale (POS) Interface
- **Responsive POS interface** for cashiers and sales staff
- **Product search** by barcode, name, or SKU
- **Cart management** with real-time pricing
- **Multiple payment methods** (cash, card, digital wallets, split payments)
- **Receipt generation** (print and email)
- **Customer lookup** and loyalty integration
- **Real-time discount** application

### 2. Inventory Management
- **Real-time inventory dashboard** with current stock levels
- **Low-stock alerts** and automated reorder notifications
- **Product management** with categories and suppliers
- **Stock adjustments** and inventory logs
- **Batch/expiry date tracking**
- **Multi-location inventory** support

### 3. Customer Management & Loyalty
- **Customer profiles** with purchase history
- **Loyalty points program** with multiple tiers (Bronze, Silver, Gold, Platinum)
- **Customer search** and management
- **Purchase history tracking**
- **Personalized promotions** and campaigns

### 4. Sales Analytics & Reporting
- **Management dashboard** with key metrics
- **Sales tracking** (daily, weekly, monthly)
- **Top products** and performance analytics
- **Revenue breakdowns** by category and time period
- **Transaction history** and reporting
- **Export capabilities** (CSV, PDF)

### 5. Staff Management & Security
- **Role-based access control** (Admin, Manager, Cashier, Staff)
- **Staff scheduling** and shift management
- **Permission management** for sensitive operations
- **Manager approval** for discounts and voids
- **Secure PIN system** for overrides

### 6. Return & Exchange System
- **Transaction lookup** by receipt number
- **Item scanning** for returns
- **Refund processing** with multiple payment methods
- **Exchange workflow** with price adjustments
- **Return tracking** and analytics

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **Forms**: React Hook Form with Zod validation
- **Real-time**: Supabase Realtime subscriptions
- **Routing**: React Router v6

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🧪 Demo Mode

The application includes a demo mode with mock data for testing purposes. In development mode, you can use these demo accounts:

- **Admin Account**: `admin@retailpos.com` / `admin123`
- **Cashier Account**: `cashier@retailpos.com` / `cashier123`

## 🎨 UI/UX Features

- **Responsive design** that works on desktop, tablet, and mobile
- **Modern interface** with clean, intuitive navigation
- **Real-time updates** for inventory and sales
- **Touch-friendly** interface for tablet-based POS terminals
- **Dark/light mode** support (coming soon)
- **Accessibility** compliant with WCAG guidelines

## 🔧 Configuration

### Database Setup (Supabase)

Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'cashier', 'staff')),
  store_id UUID,
  is_active BOOLEAN DEFAULT true,
  pin_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  category_id UUID,
  supplier_id UUID,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  weight DECIMAL(10,2),
  dimensions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional tables for transactions, categories, suppliers, etc.
```

### Environment Variables

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `REACT_APP_TAX_RATE`: Default tax rate (e.g., 0.08 for 8%)
- `REACT_APP_CURRENCY`: Currency code (e.g., USD)
- `REACT_APP_STORE_NAME`: Your store name

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Self-hosted
1. Build the project: `npm run build`
2. Serve the `build` folder with any web server

## 📱 Mobile Support

The POS system is fully responsive and optimized for:
- **Desktop computers** (primary POS terminals)
- **Tablets** (mobile POS stations)
- **Smartphones** (inventory management on-the-go)

## 🔐 Security Features

- **JWT-based authentication** with Supabase
- **Role-based access control** (RBAC)
- **PIN protection** for sensitive operations
- **Secure payment processing** (tokenized transactions)
- **Audit trails** for all transactions
- **Data encryption** at rest and in transit

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic POS interface
- ✅ Product management
- ✅ Customer management
- ✅ Payment processing
- ✅ Basic reporting

### Phase 2 (Next)
- 🔄 Barcode scanning integration
- 🔄 Receipt printing
- 🔄 Advanced inventory features
- 🔄 Staff scheduling
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 E-commerce integration
- 📋 QuickBooks integration
- 📋 Multi-store management
- 📋 Advanced CRM features
- 📋 AI-powered analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, email support@retailpos.com or join our Discord community.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Lucide](https://lucide.dev/) - Icon library
- [Unsplash](https://unsplash.com/) - Demo images
