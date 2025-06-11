class Product {
  constructor({
    id,
    name,
    slug,
    description,
    sku,
    price,
    sale_price,
    category_id,
    category_name,
    category_slug,
    is_featured,
    is_active,
    created_at,
    updated_at,
    images = [],
    sizes_quantities = []
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.sku = sku;
    this.price = price;
    this.sale_price = sale_price;
    this.category_id = category_id;
    this.category_name = category_name;
    this.category_slug = category_slug;
    this.is_featured = is_featured;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.images = images;
    this.sizes_quantities = sizes_quantities;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      sku: this.sku,
      price: this.price,
      sale_price: this.sale_price,
      category: {
        id: this.category_id,
        name: this.category_name,
        slug: this.category_slug
      },
      is_featured: this.is_featured,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      images: this.images,
      sizes_quantities: this.sizes_quantities
    };
  }
}

module.exports = Product; 