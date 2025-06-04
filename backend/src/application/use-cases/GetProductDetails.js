class GetProductDetails {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    return this.productRepository.findById(id);
  }
}

module.exports = GetProductDetails; 