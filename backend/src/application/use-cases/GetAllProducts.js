class GetAllProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(page = 1, limit = 6, filters = {}) {
    const { category, minPrice, maxPrice, sort, attributes } = filters;
    
    // Validate price range
    const validatedMinPrice = minPrice || 2000000; // 2 triệu
    const validatedMaxPrice = maxPrice || 200000000; // 200 triệu

    // Add price filters to the filters object
    const validatedFilters = {
      ...filters,
      minPrice: validatedMinPrice,
      maxPrice: validatedMaxPrice,
      attributes: attributes || {}
    };

    console.log('Validated filters:', validatedFilters); // Debug log

    return this.productRepository.findAll(page, limit, validatedFilters);
  }
}

module.exports = GetAllProducts; 