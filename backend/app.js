const express = require('express');
const cors = require('cors');
const config = require('./config');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/products', productRoutes);

// Trang chủ test
app.get('/', (req, res) => {
  res.send('Mintie Jewelry Backend API');
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
