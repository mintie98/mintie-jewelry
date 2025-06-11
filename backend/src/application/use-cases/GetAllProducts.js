class GetAllProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(page = 1, limit = 6, filters = {}) {
    const { category, minPrice, maxPrice, sort } = filters;
    
    // Validate price range
    const validatedMinPrice = minPrice ? parseFloat(minPrice) : 2000000; // 2 triệu
    const validatedMaxPrice = maxPrice ? parseFloat(maxPrice) : 200000000; // 200 triệu

    // Add price filters to the filters object
    const validatedFilters = {
      ...filters,
      minPrice: validatedMinPrice,
      maxPrice: validatedMaxPrice
    };

    return this.productRepository.findAll(page, limit, validatedFilters);
  }
}

module.exports = GetAllProducts; 