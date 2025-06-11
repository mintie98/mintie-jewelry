const GetAllProducts = require('../../application/use-cases/GetAllProducts');
const GetProductDetails = require('../../application/use-cases/GetProductDetails');
const GetRelatedProducts = require('../../application/use-cases/GetRelatedProducts');

class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository;
    this.getAllProductsUseCase = new GetAllProducts(productRepository);
    this.getProductDetailsUseCase = new GetProductDetails(productRepository);
    this.getRelatedProductsUseCase = new GetRelatedProducts(productRepository);
  }

  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const category = req.query.category ? parseInt(req.query.category) : null;
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const sort = req.query.sort || 'newest';
      
      const filters = {
        category,
        minPrice,
        maxPrice,
        sort
      };
      
      const result = await this.getAllProductsUseCase.execute(page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProductDetails(req, res) {
    try {
      const { slug } = req.params;
      const product = await this.productRepository.findBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error in getProductDetails:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRelatedProducts(req, res) {
    try {
      const { id } = req.params;
      const relatedProducts = await this.getRelatedProductsUseCase.execute(id);
      res.json(relatedProducts);
    } catch (error) {
      console.error('Error in getRelatedProducts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ProductController; 