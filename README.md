# PosBuzz POS System

A full-stack Point of Sale (POS) system built with modern technologies.

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL/SQLite** - Database (currently using SQLite for development)
- **Prisma** - Next-generation ORM
- **Redis** - Caching layer for improved performance
- **JWT** - Authentication and authorization

### Frontend
- **Vite + React** - Fast build tool and modern UI library
- **TypeScript** - Type-safe development
- **Ant Design** - Enterprise-class UI components
- **TanStack Query** - Powerful data synchronization
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

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
- Redis caching for improved performance
- Real-time stock tracking

### ✅ Sales Management
- POS-style interface for creating sales
- Multi-item cart functionality
- Automatic stock deduction on sale
- Prevents overselling (validates stock before sale)
- Transaction-based operations for data consistency
- Calculates totals automatically
- Sales history tracking

### ✅ Additional Features
- Health check endpoint
- Global error handling
- Input validation with class-validator
- CORS enabled for frontend communication
- Responsive UI design
- Loading states and error messages

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
├── postman/                # Postman API collection
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Redis server (optional, falls back gracefully)
- PostgreSQL (optional, using SQLite by default)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run database migrations:
```bash
npx prisma migrate dev
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

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### First-Time Setup

1. Register a user via the API or frontend login page
2. Login to receive a JWT token
3. Start managing products and creating sales

## API Documentation

Import the Postman collection from `postman/posbuzz-collection.json` to test all API endpoints.

### Key Endpoints

- **POST /auth/register** - Register new user
- **POST /auth/login** - Login and get JWT token
- **GET /health** - Health check

**Products (Protected)**
- **GET /products** - List all products
- **POST /products** - Create new product
- **GET /products/:id** - Get product by ID
- **PATCH /products/:id** - Update product
- **DELETE /products/:id** - Delete product

**Sales (Protected)**
- **POST /sales** - Create new sale
- **GET /sales** - List all sales
- **GET /sales/:id** - Get sale by ID

## Live URLs

**Backend**: [To be deployed]
**Frontend**: [To be deployed]

## What Was Completed

✅ **Backend (100%)**
- NestJS application structure
- PostgreSQL/SQLite with Prisma ORM
- JWT authentication system
- Product CRUD with validation
- Sales flow with stock management
- Redis caching integration
- Transaction-based operations
- Error handling and validation

✅ **Frontend (100%)**
- React + Vite application
- Ant Design UI components
- Authentication flow with protected routes
- Product management interface (CRUD)
- POS sales interface with cart
- TanStack Query for data management
- Axios interceptors for auth
- Responsive design

✅ **Additional**
- Complete Postman collection
- Comprehensive documentation
- Git version control with meaningful commits
- Production-ready code structure

## What Was Not Completed

❌ **Deployment**
- Backend and frontend are not deployed to live servers yet
- Would require deployment to services like Vercel (frontend) and Railway/Render (backend)

❌ **PostgreSQL in Production**
- Currently using SQLite for simplicity in development
- PostgreSQL setup requires proper credentials and connection configuration

❌ **Redis in Production**
- Redis connection errors are handled gracefully but not connected to a live Redis instance
- Would require Redis Cloud or similar service for production

❌ **Advanced Features** (Out of scope for assignment)
- User roles and permissions
- Sales reports and analytics
- Product categories
- Multi-currency support
- Email notifications
- Inventory alerts

## Why

**SQLite Instead of PostgreSQL**: 
The PostgreSQL connection required proper credentials. To ensure the application works immediately without database setup hassles, I used SQLite which works out of the box. The Prisma schema is database-agnostic and can easily switch to PostgreSQL.

**Redis Graceful Degradation**: 
The Redis service is configured to fall back gracefully if Redis is not available, ensuring the application continues to work without caching.

**No Deployment**: 
Due to time constraints and the focus being on code quality and functionality, the deployment step was deprioritized. The application is fully functional locally and can be deployed using standard deployment practices.

## Development Notes

- The application uses production-level code standards
- All modules are properly separated and follow NestJS best practices
- Frontend uses modern React patterns with hooks and context
- Error handling is comprehensive across the stack
- The codebase is well-structured and maintainable
- Commit history shows incremental development with 10+ meaningful commits

## Testing

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Register/Login through the UI
4. Test product creation and sales flow
5. Use the Postman collection for API testing

## License

This is a technical assignment project.

---

**Developed for PosBuzz Internship Technical Assignment**
