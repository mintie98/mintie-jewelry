class Product {
  constructor({
    id,
    name,
    slug,
    description,
    category_id,
    category_name,
    category_slug,
    is_featured,
    is_active,
    created_at,
    updated_at,
    variants = []
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.category_id = category_id;
    this.category_name = category_name;
    this.category_slug = category_slug;
    this.is_featured = is_featured;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.variants = variants;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      category_id: this.category_id,
      category_name: this.category_name,
      category_slug: this.category_slug,
      is_featured: this.is_featured,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      variants: this.variants.map(variant => ({
        id: variant.id,
        product_id: variant.product_id,
        sku: variant.sku,
        price: variant.price,
        sale_price: variant.sale_price,
        is_active: variant.is_active,
        created_at: variant.created_at,
        updated_at: variant.updated_at,
        images: variant.images || [],
        sizes_quantities: variant.sizes_quantities || []
      }))
    };
  }
}

module.exports = Product; 