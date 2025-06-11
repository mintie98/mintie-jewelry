class CategoryController {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAllCategories(req, res) {
    try {
      const categories = await this.categoryRepository.findAll();
      res.json(categories);
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getFeaturedCategories(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const categories = await this.categoryRepository.findFeaturedCategories(limit);
      res.json(categories);
    } catch (error) {
      console.error('Error in getFeaturedCategories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = CategoryController; 