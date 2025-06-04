const ProductRepository = require('../../domain/repositories/ProductRepository');
const Product = require('../../domain/entities/Product');
const db = require('../database/db');

class MySQLProductRepository extends ProductRepository {
  async findAll() {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.category_id,
        p.is_featured,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pv.id,
              'sku', pv.sku,
              'price', pv.price,
              'sale_price', pv.sale_price,
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
                ORDER BY pi.is_primary DESC, pi.display_order ASC
              )
            )
          )
          FROM product_variants pv
          WHERE pv.product_id = p.id AND pv.is_active = TRUE
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `;

    const [rows] = await db.query(query);
    
    return rows.map(row => {
      let parsedVariants = [];
      try {
        if (row.variants) {
          parsedVariants = typeof row.variants === 'string' ? JSON.parse(row.variants) : row.variants;
          
          // Parse images for each variant
          parsedVariants = parsedVariants.map(variant => {
            let images = [];
            try {
              if (variant.images) {
                images = typeof variant.images === 'string' ? JSON.parse(variant.images) : variant.images;
              }
            } catch (e) {
              console.error('Error parsing variant images JSON:', e);
            }
            return {
              ...variant,
              images: images
            };
          });
        }
      } catch (e) {
        console.error('Error parsing variants JSON:', e);
      }

      return new Product({
        ...row,
        variants: parsedVariants
      });
    });
  }

  async findById(id) {
    // Get product basic info
    const [productRows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.category_id,
        p.is_featured,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (!productRows || productRows.length === 0) {
      return null;
    }

    const product = productRows[0];

    // Get variants with their images and quantities per size
    const [variantsData] = await db.query(`
      SELECT
        pv.id,
        pv.product_id,
        pv.sku,
        pv.price,
        pv.sale_price,
        pv.is_active,
        pv.created_at AS variant_created_at,
        pv.updated_at AS variant_updated_at,
        (
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
          ORDER BY pi.is_primary DESC, pi.display_order ASC
        ) as images,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'size', pq.size,
              'quantity', pq.quantity
            )
          )
          FROM product_quantities pq
          WHERE pq.variant_id = pv.id
          ORDER BY CAST(pq.size AS DECIMAL)
        ) as sizes_quantities
      FROM product_variants pv
      WHERE pv.product_id = ? AND pv.is_active = TRUE
      GROUP BY pv.id
      ORDER BY pv.id ASC
    `, [id]);

    // Format variants
    const variants = variantsData.map(variant => {
      let images = [];
      let sizes_quantities = [];

      try {
        if (variant.images) {
          images = typeof variant.images === 'string' ? JSON.parse(variant.images) : variant.images;
        }
      } catch (e) {
        console.error('Error parsing images JSON:', e);
      }

      try {
        if (variant.sizes_quantities) {
          sizes_quantities = typeof variant.sizes_quantities === 'string' ? JSON.parse(variant.sizes_quantities) : variant.sizes_quantities;
        }
      } catch (e) {
        console.error('Error parsing sizes_quantities JSON:', e);
      }

      return {
        id: variant.id,
        product_id: variant.product_id,
        sku: variant.sku,
        price: variant.price,
        sale_price: variant.sale_price,
        is_active: variant.is_active,
        created_at: variant.variant_created_at,
        updated_at: variant.variant_updated_at,
        images: images,
        sizes_quantities: sizes_quantities
      };
    });

    return new Product({
      ...product,
      variants
    });
  }

  async findRelatedProducts(productId) {
    // First get the category_id of the current product
    const [categoryResult] = await db.query(
      'SELECT category_id FROM products WHERE id = ?',
      [productId]
    );

    if (!categoryResult || categoryResult.length === 0) {
      return [];
    }

    const categoryId = categoryResult[0].category_id;

    // Then get related products from the same category
    const [relatedProductsData] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.category_id,
        p.is_featured,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pv.id,
              'sku', pv.sku,
              'price', pv.price,
              'sale_price', pv.sale_price,
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
                ORDER BY pi.is_primary DESC, pi.display_order ASC
              )
            )
          )
          FROM product_variants pv
          WHERE pv.product_id = p.id AND pv.is_active = TRUE
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
      ORDER BY RAND()
      LIMIT 4
    `, [categoryId, productId]);

    return relatedProductsData.map(row => {
      let parsedVariants = [];
      try {
        if (row.variants) {
          parsedVariants = typeof row.variants === 'string' ? JSON.parse(row.variants) : row.variants;
          
          // Parse images for each variant
          parsedVariants = parsedVariants.map(variant => {
            let images = [];
            try {
              if (variant.images) {
                images = typeof variant.images === 'string' ? JSON.parse(variant.images) : variant.images;
              }
            } catch (e) {
              console.error('Error parsing variant images JSON:', e);
            }
            return {
              ...variant,
              images: images
            };
          });
        }
      } catch (e) {
        console.error('Error parsing variants JSON:', e);
      }

      return new Product({
        ...row,
        variants: parsedVariants
      });
    });
  }
}

module.exports = MySQLProductRepository; 