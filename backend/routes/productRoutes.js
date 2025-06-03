const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/
router.get('/', productController.getAllProducts);

// GET /api/products  <-- Thêm route này để xử lý khi không có dấu / ở cuối
router.get('', productController.getAllProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductDetails);

// GET /api/products/related/:id
router.get('/related/:id', productController.getRelatedProducts);

module.exports = router;
