class GetRelatedProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId) {
    return this.productRepository.findRelatedProducts(productId);
  }
}

module.exports = GetRelatedProducts; 