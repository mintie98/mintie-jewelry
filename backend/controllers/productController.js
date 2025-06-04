const db = require('../models/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        (
          SELECT pv_price.price
          FROM product_variants pv_price
          WHERE pv_price.product_id = p.id AND pv_price.is_active = TRUE
          ORDER BY pv_price.id ASC
          LIMIT 1
        ) AS price,
        (
          SELECT pv_sale.sale_price
          FROM product_variants pv_sale
          WHERE pv_sale.product_id = p.id AND pv_sale.is_active = TRUE
          ORDER BY pv_sale.id ASC
          LIMIT 1
        ) AS sale_price,
        (
          SELECT pi.image_url
          FROM product_variants pv_img
          JOIN product_images pi ON pv_img.id = pi.variant_id
          WHERE pv_img.product_id = p.id AND pv_img.is_active = TRUE
          ORDER BY pi.is_primary DESC, pi.display_order ASC, pv_img.id ASC
          LIMIT 1
        ) AS image,
        c.slug AS category_slug,
        c.name AS category_name,
        p.is_featured,
        p.is_active
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);
    res.json(products);
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

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
      WHERE p.id = ? AND p.is_active = TRUE
    `, [productId]);

    if (!productRows || productRows.length === 0) {
      return res.status(404).json({ message: 'Product not found or not active' });
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
    `, [productId]);

    // Format the response
    const formattedProduct = {
      ...product,
      variants: variantsData.map(variant => {
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
      })
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error in getProductDetails:', error);
    res.status(500).json({ message: 'Error fetching product details', details: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const currentProductId = req.params.id;
    const [relatedProductsData] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.category_id,
        p.is_featured,
        p.is_active AS product_is_active,
        p.created_at AS product_created_at,
        p.updated_at AS product_updated_at,
        c.name as category_name,
        c.slug as category_slug,
        (
          SELECT pv_price.price
          FROM product_variants pv_price
          WHERE pv_price.product_id = p.id AND pv_price.is_active = TRUE
          ORDER BY pv_price.id ASC
          LIMIT 1
        ) AS price,
        (
          SELECT pv_sale.sale_price
          FROM product_variants pv_sale
          WHERE pv_sale.product_id = p.id AND pv_sale.is_active = TRUE
          ORDER BY pv_sale.id ASC
          LIMIT 1
        ) AS sale_price,
        (
          SELECT pi.image_url
          FROM product_variants pv_img
          JOIN product_images pi ON pv_img.id = pi.variant_id
          WHERE pv_img.product_id = p.id AND pv_img.is_active = TRUE
          ORDER BY pi.is_primary DESC, pi.display_order ASC, pv_img.id ASC
          LIMIT 1
        ) AS image,
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
              ),
              'sizes_quantities', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'size', pq.size,
                    'quantity', pq.quantity
                  )
                )
                FROM product_quantities pq
                WHERE pq.variant_id = pv.id
                ORDER BY CAST(pq.size AS DECIMAL)
              )
            )
          FROM product_variants pv
          WHERE pv.product_id = p.id AND pv.is_active = TRUE
        ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = (
        SELECT category_id FROM products WHERE id = ?
      )
      AND p.id != ?
      AND p.is_active = TRUE
      GROUP BY p.id
      ORDER BY RAND()
      LIMIT 4
    `, [currentProductId, currentProductId]);

    // Format lại variants nếu nó là một chuỗi JSON
    const formattedProducts = relatedProductsData.map(product => {
      let parsedVariants = [];
      try {
        if (product.variants) {
          parsedVariants = typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants;
        }
      } catch (e) {
        console.error("Error parsing variants JSON for product ID " + product.id, e);
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        category_id: product.category_id,
        category_name: product.category_name,
        category_slug: product.category_slug,
        is_featured: product.is_featured,
        is_active: product.product_is_active,
        created_at: product.product_created_at,
        updated_at: product.product_updated_at,
        price: product.price,
        sale_price: product.sale_price,
        image: product.image,
        variants: parsedVariants.map(variant => {
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
            ...variant,
            images: images,
            sizes_quantities: sizes_quantities
          };
        })
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    res.status(500).json({ message: 'Error fetching related products', details: error.message });
  }
};