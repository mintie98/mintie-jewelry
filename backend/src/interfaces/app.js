const express = require('express');
const cors = require('cors');
const path = require('path');
const ProductController = require('./controllers/ProductController');
const CategoryController = require('./controllers/CategoryController');
const MySQLProductRepository = require('../infrastructure/repositories/MySQLProductRepository');
const MySQLCategoryRepository = require('../infrastructure/repositories/MySQLCategoryRepository');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const config = require('../infrastructure/config/config');

const app = express();

// Initialize repositories
const productRepository = new MySQLProductRepository();
const categoryRepository = new MySQLCategoryRepository();

// Initialize controllers
const productController = new ProductController(productRepository);
const categoryController = new CategoryController(categoryRepository);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../infrastructure/storage')));

// Routes
app.use('/api', productRoutes(productController));
app.use('/api', categoryRoutes(categoryController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
