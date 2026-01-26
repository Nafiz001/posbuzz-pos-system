# PosBuzz POS System 🚀

A production-ready, full-stack Point of Sale (POS) system built with modern technologies and deployed to live servers.

## 🌐 Live Deployment

- **Frontend**: [https://posbuzz-pos-system.vercel.app](https://posbuzz-pos-system.vercel.app)
- **Backend API**: [https://posbuzz-pos-system.onrender.com](https://posbuzz-pos-system.onrender.com)
- **API Health**: [https://posbuzz-pos-system.onrender.com/health](https://posbuzz-pos-system.onrender.com/health)

> **Note**: Backend may take 30-60 seconds to wake up on first request (Render free tier)

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Supabase cloud database (production)
- **Prisma ORM** - Version 5.22.0 for database management
- **Redis** - Upstash serverless Redis for caching
- **JWT** - Authentication and authorization
- **bcrypt** - Secure password hashing

### Frontend
- **Vite + React** - Fast build tool and modern UI library
- **TypeScript** - Type-safe development
- **Ant Design** - Enterprise-class UI components
- **TanStack Query** - Powerful data synchronization
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

### Infrastructure
- **Frontend Hosting**: Vercel (global CDN, automatic deployments)
- **Backend Hosting**: Render (containerized Node.js)
- **Database**: Supabase PostgreSQL (cloud)
- **Redis Cache**: Upstash (serverless Redis)

## Features Implemented

### ✅ Authentication
- Email and password-based login
- JWT token generation and validation
- Protected API routes
- Automatic token refresh via interceptors
- Secure password hashing with bcrypt

### ✅ Product Management
- Create, Read, Update, Delete (CRUD) operations
- Product fields: name, SKU, price, stock quantity
- Unique SKU validation
- **Redis caching** with automatic invalidation
- Real-time stock tracking
- Search functionality
- Color-coded stock badges (out of stock/low/in stock)
- Sortable and paginated product tables

### ✅ Sales Management
- Modern POS-style interface for creating sales
- Multi-item cart functionality
- **Automatic stock deduction** on completed sale
- Prevents overselling (validates stock before sale)
- **Transaction-based operations** with Prisma for data consistency
- **Cache invalidation** after stock updates
- Sales history with detailed transaction records

### ✅ Additional Features
- Registration page with password confirmation
- Modern UI redesign with gradient backgrounds
- Health check endpoint
- Global error handling
- Input validation with class-validator
- CORS enabled for frontend communication
- Responsive full-screen layout
- Loading states and error messages
- React Query with automatic refetching

## Project Structure

```
posbuzz-pos-system/
├── backend/                 # NestJS backend application
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── products/       # Product management module
│   │   ├── sales/          # Sales management module
│   │   ├── redis/          # Redis caching module
│   │   └── prisma/         # Prisma service
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── lib/            # Utilities and API client
│   │   └── pages/          # Application pages
│   └── package.json
└── postman/                # API collection for testing
```

## Getting Started

### Quick Start with Live Deployment

Simply visit [https://posbuzz-pos-system.vercel.app](https://posbuzz-pos-system.vercel.app) to use the application immediately!

1. Register a new account
2. Login with your credentials
3. Start managing products and creating sales

### Prerequisites for Local Development
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL or Supabase account
- Upstash Redis account (optional)

### Backend Setup (Local)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (create `.env` file):
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secure-random-secret"
JWT_EXPIRES_IN="7d"
REDIS_URL="your-upstash-redis-url"
PORT=3000
```

4. Run database migrations:
```bash
npx prisma migrate deploy
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup (Local)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (create `.env` file):
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

### Postman Collection

Import the `postman/posbuzz-collection.json` file into Postman.

### First-Time Setup

**Collection Features:**
- Automatic environment variable management
- Pre-configured authorization
- All endpoints documented with examples

### Key Endpoints

**Public Routes**
- **POST /auth/register** - Register new user
- **POST /auth/login** - Login and get JWT token
- **GET /health** - Health check

**Protected Routes (Requires JWT)**

**Products**
- **GET /products** - List all products (cached)
- **POST /products** - Create new product
- **GET /products/:id** - Get product by ID
- **PATCH /products/:id** - Update product
- **DELETE /products/:id** - Delete product

**Sales**
- **GET /sales** - List all sales
- **POST /sales** - Create new sale (auto stock deduction)
- **GET /sales/:id** - Get sale by ID

## 📊 Project Status

### ✅ What Was Completed (100%)

**Backend**
- ✅ NestJS application with modular architecture
- ✅ PostgreSQL database with Supabase (production)
- ✅ Prisma ORM v5.22.0 (downgraded for stability)
- ✅ JWT authentication with bcrypt hashing
- ✅ Product CRUD with validation and caching
- ✅ Sales flow with stock management
- ✅ Redis caching with Upstash integration
- ✅ Transaction-based operations for data integrity
- ✅ Cache invalidation on stock updates
- ✅ Comprehensive error handling
- ✅ **Deployed to Render** with live URL

**Frontend**
- ✅ React + Vite application with TypeScript
- ✅ Ant Design UI components
- ✅ Authentication flow with protected routes
- ✅ Registration page with validation
- ✅ Product management interface (CRUD)
- ✅ Modern POS sales interface with cart
- ✅ TanStack Query for data management
- ✅ Axios interceptors for authentication
- ✅ Responsive full-screen design
- ✅ SPA routing configuration
- ✅ **Deployed to Vercel** with live URL

**DevOps & Documentation**
- ✅ Complete Postman collection (v2.1.0)
- ✅ Comprehensive README documentation
- ✅ Git version control with 15+ meaningful commits
- ✅ Production environment configuration
- ✅ **Live deployment** on Vercel + Render
- ✅ Cloud database (Supabase PostgreSQL)
- ✅ Serverless Redis (Upstash)

## Known Limitations

- Backend cold starts on Render free tier (30–60 seconds)
- No refresh token mechanism
- No role-based access control
- No automated tests (out of scope)

### 🎯 Assignment Requirements Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| NestJS Backend | ✅ 100% | Modular architecture |
| PostgreSQL | ✅ 100% | Supabase cloud database |
| Prisma ORM | ✅ 100% | Version 5.22.0 |
| Redis | ✅ 100% | Upstash serverless |
| Vite + React | ✅ 100% | TypeScript, modern UI |
| Ant Design | ✅ 100% | Professional components |
| TanStack Query | ✅ 100% | Data synchronization |
| Authentication | ✅ 100% | JWT with bcrypt |
| Product CRUD | ✅ 100% | Full CRUD with caching |
| Sales System | ✅ 100% | Stock deduction, validation |
| Deployment | ✅ 100% | Live on Vercel + Render |

## 🚀 Deployment Architecture

### Frontend (Vercel)
- Automatic deployments from GitHub main branch
- Global CDN for fast loading
- Environment variables for API URL
- SPA routing with vercel.json configuration

### Backend (Render)
- Containerized Node.js deployment
- Automatic builds from GitHub
- Health check monitoring
- Environment variables configured

## Testing

### Live Production Testing
1. Visit [https://posbuzz-pos-system.vercel.app](https://posbuzz-pos-system.vercel.app)
2. Register a new account
3. Login with credentials
4. Create products with different stock levels
5. Test sales flow with cart functionality
6. Verify stock deduction after sale
7. Test search and filtering

### Local Development Testing
1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Register/Login through the UI
4. Test product creation and sales flow
5. Use the Postman collection for API testing

### API Testing with Postman
1. Import `postman/posbuzz-collection.json`
2. Set `BASE_URL` to `https://posbuzz-pos-system.onrender.com` (or `http://localhost:3000` for local)
3. Run "Register" and "Login" requests
4. Token will be automatically stored
5. Test all other endpoints

## 📈 Performance Considerations

- **Redis caching**: Product listings cached for 1 hour
- **Automatic cache invalidation**: On create/update/delete/stock changes
- **React Query**: Optimistic updates and background refetching
- **Prisma transactions**: Ensures data consistency
- **Connection pooling**: Efficient database connections

## Design Decisions

- **PostgreSQL (Supabase)** was used as the production database for reliability and scalability.
- **Prisma transactions** ensure atomic sales and stock updates.
- **Redis (Upstash)** is used for caching product listings and reducing database load.
- **Render free tier** was chosen for backend hosting; cold starts are expected.
- **Vercel** was chosen for frontend hosting due to excellent React + Vite support.

## License

This is a technical assignment project.

---

**Developed for PosBuzz Internship Technical Assignment**  
**Deadline**: January 29, 2026  
**Status**: ✅ **Completed and Deployed**
