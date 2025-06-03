const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/:id/images
router.get('/:id/images', productController.getProductImages);

// GET /api/products/
router.get('/', productController.getAllProducts);

// GET /api/products  <-- Thêm route này để xử lý khi không có dấu / ở cuối
router.get('', productController.getAllProducts);

module.exports = router;
