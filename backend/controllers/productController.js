const db = require('../models/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.price,
        p.sale_price,
        p.description,
        (
            SELECT pi.image_url
            FROM product_variants pv
            JOIN product_images pi ON pv.id = pi.variant_id
            WHERE pv.product_id = p.id
            ORDER BY pi.is_primary DESC, pi.display_order ASC
            LIMIT 1
        ) AS image,
        c.slug AS category_slug,
        c.name AS category_name,
        p.is_featured,
        p.is_active
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `);
    res.json(products);
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    // Get product basic info
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    // Get variants with their images
    const [variants] = await db.query(`
      SELECT 
        pv.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', pi.id,
            'image_url', pi.image_url,
            'is_primary', pi.is_primary,
            'display_order', pi.display_order
          )
        ) as images
      FROM product_variants pv
      LEFT JOIN product_images pi ON pv.id = pi.variant_id
      WHERE pv.product_id = ? AND pi.id IS NOT NULL
      GROUP BY pv.id
    `, [req.params.id]);

    // Format the response
    const formattedProduct = {
      ...product,
      variants: variants.map(variant => ({
        ...variant,
        images: variant.images || []
      }))
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error in getProductDetails:', error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    // Get related products from the same category
    const [relatedProducts] = await db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pv.id,
              'sku', pv.sku,
              'price', pv.price,
              'sale_price', pv.sale_price,
              'stock', pv.stock,
              'is_active', pv.is_active,
              'images', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', pi.id,
                    'image_url', pi.image_url,
                    'is_primary', pi.is_primary,
                    'display_order', pi.display_order
                  )
                )
                FROM product_images pi
                WHERE pi.variant_id = pv.id
              )
            )
          )
          FROM product_variants pv
          WHERE pv.product_id = p.id
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = (
        SELECT category_id FROM products WHERE id = ?
      )
      AND p.id != ?
      AND p.is_active = true
      GROUP BY p.id
      LIMIT 4
    `, [req.params.id, req.params.id]);

    // Format the response
    const formattedProducts = relatedProducts.map(product => ({
      ...product,
      variants: product.variants || []
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    res.status(500).json({ message: 'Error fetching related products' });
  }
};
