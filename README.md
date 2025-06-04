# Mintie Jewelry

A modern e-commerce website for jewelry products built with React and Node.js.

## Features

- 🛍️ **Product Catalog**: Browse through a collection of jewelry products
- 🔍 **Product Details**: View detailed information about each product including images, sizes, and prices
- 🛒 **Shopping Cart**: Add products to cart, manage quantities, and view order summary
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Modern UI**: Clean and elegant design with smooth animations

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Axios

### Backend
- Node.js
- Express
- MySQL
- MySQL2

## Project Structure

```
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-specific components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static files
│
├── backend/               # Node.js backend application
│   ├── controllers/      # Route controllers
│   ├── routes/          # API routes
│   ├── uploads/         # Product images
│   └── config.js        # Configuration
│
└── database/            # Database schema and migrations
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mintie98/mintie-jewelry.git
cd mintie-jewelry
```

2. Set up the database:
```bash
# Create a new MySQL database named 'Jewelry'
# Import the schema from database/schema.sql
```

3. Set up the backend:
```bash
cd backend
npm install
# Create a .env file with your database credentials
npm start
```

4. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/related/:id` - Get related products

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 