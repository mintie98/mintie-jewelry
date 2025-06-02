# Jewelry E-commerce Website

A modern e-commerce platform for jewelry products, inspired by SJC's website.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Redux Toolkit

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM

## Project Structure
```
jewelry/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── database/          # Database migrations and seeds
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Set up the database:
   - Create a MySQL database
   - Update the database configuration in `backend/.env`

5. Start the development servers:
   - Frontend: `cd frontend && npm start`
   - Backend: `cd backend && npm run dev`

## Features
- Product catalog with categories
- User authentication
- Shopping cart
- Order management
- Admin dashboard
- Responsive design 