const express = require('express');

module.exports = (productController) => {
  const router = express.Router();

  router.get('/products', productController.getAllProducts.bind(productController));
  router.get('/products/:slug', productController.getProductDetails.bind(productController));
  router.get('/products/:slug/related', productController.getRelatedProducts.bind(productController));

  return router;
}; 