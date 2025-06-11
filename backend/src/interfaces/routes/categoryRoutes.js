const express = require('express');
const router = express.Router();

module.exports = (categoryController) => {
  router.get('/categories', categoryController.getAllCategories.bind(categoryController));
  router.get('/categories/featured', categoryController.getFeaturedCategories.bind(categoryController));

  return router;
}; 