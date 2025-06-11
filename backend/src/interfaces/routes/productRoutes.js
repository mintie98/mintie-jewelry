const express = require('express');
const router = express.Router();

module.exports = (productController) => {
  router.get('/products', productController.getAllProducts.bind(productController));
  router.get('/products/:slug', productController.getProductDetails.bind(productController));
  router.get('/products/:id/related', productController.getRelatedProducts.bind(productController));

  return router;
}; 