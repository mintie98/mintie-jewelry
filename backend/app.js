const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import our clean architecture components
const MySQLProductRepository = require('./src/infrastructure/repositories/MySQLProductRepository');
const ProductController = require('./src/interfaces/controllers/ProductController');
const productRoutes = require('./src/interfaces/routes/productRoutes');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize repository and controller
const productRepository = new MySQLProductRepository();
const productController = new ProductController(productRepository);

// Routes
app.use('/api/products', productRoutes(productController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
