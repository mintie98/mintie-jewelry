const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
