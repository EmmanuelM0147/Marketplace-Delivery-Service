# DeliverEase - Marketplace Delivery Management System

[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.38-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Laravel](https://img.shields.io/badge/Laravel-Backend-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DeliverEase is a comprehensive marketplace delivery management system that streamlines order processing, courier management, and real-time delivery tracking. Built with modern web technologies, it provides businesses with powerful tools to manage their delivery operations efficiently while offering customers transparent tracking capabilities.

## 🚀 Key Features

### 📊 Dashboard & Analytics
- **Real-time Dashboard** - Monitor delivery operations with live statistics and charts
- **Performance Analytics** - Track delivery times, success rates, and courier performance
- **Interactive Charts** - Visual representation of delivery data with Chart.js
- **KPI Monitoring** - Key performance indicators for business insights

### 📦 Order Management
- **Order Processing** - Complete order lifecycle management from creation to delivery
- **Status Tracking** - Real-time order status updates with detailed tracking
- **Bulk Operations** - Efficient handling of multiple orders
- **Customer Information** - Comprehensive customer data management

### 🚚 Courier Management
- **Courier Profiles** - Detailed courier information and performance tracking
- **Real-time Location** - Live courier tracking with interactive maps
- **Status Management** - Available, busy, and offline status tracking
- **Performance Metrics** - Rating system and delivery statistics

### 🗺️ Delivery Tracking
- **Live Map View** - Real-time delivery tracking with Leaflet maps
- **Route Optimization** - Efficient delivery route planning
- **Customer Tracking** - Public tracking interface for customers
- **Delivery History** - Complete delivery timeline and status updates

### 🔔 Notifications
- **Real-time Alerts** - Instant notifications for order and delivery updates
- **Multi-channel** - Email and browser notifications
- **Customizable** - User-configurable notification preferences

### 🔐 Security & Authentication
- **Secure Login** - JWT-based authentication system
- **Role-based Access** - Different access levels for different user types
- **Session Management** - Secure session handling and logout

## 🛠️ Technologies & Frameworks

### Frontend
- **Vue.js 3.4.38** - Progressive JavaScript framework with Composition API
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **Pinia 2.1.7** - State management for Vue.js
- **Vue Router 4.2.5** - Official router for Vue.js
- **Chart.js 4.4.0** - Interactive charts and data visualization
- **Leaflet 1.9.4** - Interactive maps for delivery tracking
- **Axios 1.6.0** - HTTP client for API requests
- **Day.js 1.11.10** - Date manipulation library

### Backend
- **PHP Laravel** - Robust backend framework
- **MySQL** - Relational database management
- **RESTful API** - Clean API architecture
- **Guzzle HTTP** - HTTP client for external API integration

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## 📋 Installation Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PHP** (v8.1 or higher)
- **Composer**
- **MySQL** (v8.0 or higher)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/deliverease.git
   cd deliverease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_DHL_API_URL=https://api-mock.dhl.com/mydhl/
   VITE_DHL_API_KEY=your_dhl_api_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to API directory**
   ```bash
   cd public/api
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

4. **Configure database and API keys**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=marketplace_delivery
   DB_USERNAME=root
   DB_PASSWORD=your_password

   DHL_API_KEY=your_dhl_api_key_here
   DHL_API_URL=https://api-mock.dhl.com/mydhl/
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Start Laravel server**
   ```bash
   php artisan serve
   ```

## ⚙️ Configuration Requirements

### Environment Variables

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# DHL API Configuration
VITE_DHL_API_URL=https://api-mock.dhl.com/mydhl/
VITE_DHL_API_KEY=your_dhl_api_key_here
```

#### Backend (public/api/.env)
```env
# Application
APP_NAME=DeliverEase
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=marketplace_delivery
DB_USERNAME=root
DB_PASSWORD=your_password

# External APIs
DHL_API_KEY=your_dhl_api_key_here
DHL_API_URL=https://api-mock.dhl.com/mydhl/
```

### Database Setup

1. **Create MySQL database**
   ```sql
   CREATE DATABASE marketplace_delivery;
   ```

2. **Run migrations**
   ```bash
   php artisan migrate
   ```

3. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

## 📖 Usage Examples

### Authentication

```typescript
// Login example
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const login = async () => {
  const success = await authStore.login('admin@example.com', 'password123')
  if (success) {
    router.push('/')
  }
}
```

### Order Management

```typescript
// Fetch and display orders
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

// Fetch all orders
await ordersStore.fetchOrders()

// Get orders by status
const pendingOrders = ordersStore.getOrdersByStatus('pending')

// Update order status
await ordersStore.updateOrderStatus(orderId, 'delivered')
```

### Courier Tracking

```typescript
// Track courier location
import { useCouriersStore } from '@/stores/couriers'

const couriersStore = useCouriersStore()

// Update courier location
await couriersStore.updateCourierLocation(courierId, {
  lat: 37.7749,
  lng: -122.4194
})

// Get available couriers
const availableCouriers = couriersStore.availableCouriers
```

### Customer Tracking

```vue
<!-- Customer tracking component -->
<template>
  <div class="tracking-container">
    <input 
      v-model="trackingCode" 
      placeholder="Enter tracking number"
      @keyup.enter="trackOrder"
    />
    <button @click="trackOrder">Track Order</button>
    
    <div v-if="order" class="order-details">
      <h3>Order #{{ order.order_number }}</h3>
      <p>Status: {{ order.status }}</p>
      <p>Estimated Delivery: {{ order.estimated_delivery }}</p>
    </div>
  </div>
</template>
```

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Order Management Endpoints

```http
# Get all orders
GET /api/orders

# Get specific order
GET /api/orders/{id}

# Update order status
PATCH /api/orders/{id}
Content-Type: application/json

{
  "status": "delivered"
}

# Assign courier to order
POST /api/orders/{id}/assign
Content-Type: application/json

{
  "courier_id": 1
}
```

### Delivery Tracking Endpoints

```http
# Get shipping rates
POST /api/delivery/rates
Content-Type: application/json

{
  "from_postal_code": "10001",
  "to_postal_code": "90210",
  "weight": 2.5
}

# Track shipment
GET /api/delivery/track/{tracking_number}

# Create shipping label
POST /api/delivery/labels
Content-Type: application/json

{
  "sender_details": {...},
  "receiver_details": {...},
  "package_details": {...}
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-12345",
    "status": "delivered",
    "customer_name": "John Doe",
    "total_amount": 99.99
  },
  "message": "Order retrieved successfully"
}
```

## 🤝 Contributing Guidelines

We welcome contributions to DeliverEase! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write tests** for new functionality
5. **Ensure code quality**
   ```bash
   npm run lint
   npm run type-check
   ```

### Code Standards

- **TypeScript** - Use TypeScript for all new code
- **Vue 3 Composition API** - Follow Vue 3 best practices
- **ESLint** - Ensure code passes linting
- **Conventional Commits** - Use conventional commit messages

### Pull Request Process

1. **Update documentation** for any new features
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the README** if needed
5. **Submit pull request** with detailed description

### Commit Message Format

```
type(scope): description

feat(orders): add bulk order processing
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 DeliverEase

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact & Support

### Project Maintainers
- **Development Team** - [dev@deliverease.com](mailto:dev@deliverease.com)
- **Support** - [support@deliverease.com](mailto:support@deliverease.com)

### Resources
- **Documentation** - [https://docs.deliverease.com](https://docs.deliverease.com)
- **Issue Tracker** - [GitHub Issues](https://github.com/your-username/deliverease/issues)
- **Discussions** - [GitHub Discussions](https://github.com/your-username/deliverease/discussions)
- **Changelog** - [CHANGELOG.md](CHANGELOG.md)

### Community
- **Discord** - [Join our Discord server](https://discord.gg/deliverease)
- **Twitter** - [@DeliverEase](https://twitter.com/deliverease)
- **LinkedIn** - [DeliverEase Company Page](https://linkedin.com/company/deliverease)

---

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Laravel Team** - For the robust backend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Chart.js** - For beautiful data visualization
- **Leaflet** - For interactive mapping capabilities
- **All Contributors** - Thank you for your contributions!

---

**Built with ❤️ by the DeliverEase Team**

*For more information, visit our [website](https://deliverease.com) or check out our [documentation](https://docs.deliverease.com).*
