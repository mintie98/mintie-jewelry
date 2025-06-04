const express = require('express');
const router = express.Router();

module.exports = (productController) => {
  router.get('/', productController.getAllProducts.bind(productController));
  router.get('/related/:id', productController.getRelatedProducts.bind(productController));
  router.get('/:id', productController.getProductDetails.bind(productController));

  return router;
}; 