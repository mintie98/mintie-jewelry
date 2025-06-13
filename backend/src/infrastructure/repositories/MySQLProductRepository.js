const ProductRepository = require('../../domain/repositories/ProductRepository');
const Product = require('../../domain/entities/Product');
const db = require('../database/db');

class MySQLProductRepository extends ProductRepository {
  constructor() {
    super();
    this.db = db;
  }

  async findAll(page = 1, limit = 6, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE p.is_active = TRUE';
    const queryParams = [];

    if (filters.category) {
      whereClause += ' AND p.category_id = ?';
      queryParams.push(filters.category);
    }

    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      whereClause += ' AND CAST(COALESCE(p.price, 0) AS DECIMAL(15,2)) BETWEEN ? AND ?';
      queryParams.push(
        filters.minPrice || 2000000,
        filters.maxPrice || 200000000
      );
    }

    // Add attribute filters
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      Object.entries(filters.attributes).forEach(([attributeId, valueIds]) => {
        if (valueIds && valueIds.length > 0) {
          whereClause += ` AND EXISTS (
            SELECT 1 FROM product_attributes pa
            JOIN attribute_values av ON pa.attribute_value_id = av.id
            WHERE pa.product_id = p.id
            AND av.attribute_id = ?
            AND av.id IN (?)
          )`;
          queryParams.push(parseInt(attributeId), valueIds.map(id => parseInt(id)));
        }
      });
    }

    // Determine sort order
    let orderByClause = 'ORDER BY ';
    switch (filters.sort) {
      case 'price-asc':
        orderByClause += 'CAST(COALESCE(p.price, 0) AS DECIMAL(15,2)) ASC';
        break;
      case 'price-desc':
        orderByClause += 'CAST(COALESCE(p.price, 0) AS DECIMAL(15,2)) DESC';
        break;
      case 'newest':
      default:
        orderByClause += 'p.created_at DESC';
        break;
    }

    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      ${whereClause}
    `;

    const productsQuery = `
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
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
          WHERE pi.product_id = p.id
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
          WHERE pq.product_id = p.id
          ORDER BY CAST(pq.size AS DECIMAL)
        ) as sizes_quantities
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      GROUP BY p.id
      ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    try {
      const [countResult] = await this.db.query(countQuery, queryParams);
      const total = countResult[0].total;

      const [products] = await this.db.query(productsQuery, [...queryParams, limit, offset]);

      return {
        products: products.map(product => {
          let images = [];
          let sizes_quantities = [];
          try {
            if (product.images) {
              images = typeof product.images === 'string' 
                ? JSON.parse(product.images) 
                : product.images;
            }
            if (product.sizes_quantities) {
              sizes_quantities = typeof product.sizes_quantities === 'string' 
                ? JSON.parse(product.sizes_quantities) 
                : product.sizes_quantities;
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }

          return {
            ...product,
            images,
            sizes_quantities
          };
        }),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug,
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
            WHERE pi.product_id = p.id
            ORDER BY pi.is_primary DESC, pi.display_order ASC
          ) as images,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'size', pq.size,
                'quantity', pq.quantity,
                'price', p.price
              )
            )
            FROM product_quantities pq
            WHERE pq.product_id = p.id
            ORDER BY CAST(pq.size AS DECIMAL)
          ) as sizes_quantities
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.is_active = TRUE
      `, [id]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      let images = [];
      let sizes_quantities = [];
      try {
        if (row.images) {
          images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
        }
        if (row.sizes_quantities) {
          sizes_quantities = typeof row.sizes_quantities === 'string' ? JSON.parse(row.sizes_quantities) : row.sizes_quantities;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }

      return new Product({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        sku: row.sku,
        price: row.price,
        sale_price: row.sale_price,
        category_id: row.category_id,
        category_name: row.category_name,
        category_slug: row.category_slug,
        is_featured: row.is_featured,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
        images: images,
        sizes_quantities: sizes_quantities
      });
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findRelatedProducts(productId, limit = 4) {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug,
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
            WHERE pi.product_id = p.id
            ORDER BY pi.is_primary DESC, pi.display_order ASC
          ) as images,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'size', pq.size,
                'quantity', pq.quantity,
                'price', p.price
              )
            )
            FROM product_quantities pq
            WHERE pq.product_id = p.id
            ORDER BY CAST(pq.size AS DECIMAL)
          ) as sizes_quantities
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = (
          SELECT category_id 
          FROM products 
          WHERE id = ?
        )
        AND p.id != ?
        AND p.is_active = TRUE
        GROUP BY p.id
        ORDER BY RAND()
        LIMIT ?
      `, [productId, productId, limit]);

      return rows.map(row => {
        let images = [];
        let sizes_quantities = [];
        try {
          if (row.images) {
            images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
          }
          if (row.sizes_quantities) {
            sizes_quantities = typeof row.sizes_quantities === 'string' ? JSON.parse(row.sizes_quantities) : row.sizes_quantities;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }

        return new Product({
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          sku: row.sku,
          price: row.price,
          sale_price: row.sale_price,
          category_id: row.category_id,
          category_name: row.category_name,
          category_slug: row.category_slug,
          is_featured: row.is_featured,
          is_active: row.is_active,
          created_at: row.created_at,
          updated_at: row.updated_at,
          images: images,
          sizes_quantities: sizes_quantities
        });
      });
    } catch (error) {
      console.error('Error in findRelatedProducts:', error);
      throw error;
    }
  }

  async findBySlug(slug) {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug,
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
            WHERE pi.product_id = p.id
            ORDER BY pi.is_primary DESC, pi.display_order ASC
          ) as images,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'size', pq.size,
                'quantity', pq.quantity,
                'price', p.price
              )
            )
            FROM product_quantities pq
            WHERE pq.product_id = p.id
            ORDER BY CAST(pq.size AS DECIMAL)
          ) as sizes_quantities
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ? AND p.is_active = TRUE
      `, [slug]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      let images = [];
      let sizes_quantities = [];
      try {
        if (row.images) {
          images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
        }
        if (row.sizes_quantities) {
          sizes_quantities = typeof row.sizes_quantities === 'string' ? JSON.parse(row.sizes_quantities) : row.sizes_quantities;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }

      return new Product({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        sku: row.sku,
        price: row.price,
        sale_price: row.sale_price,
        category_id: row.category_id,
        category_name: row.category_name,
        category_slug: row.category_slug,
        is_featured: row.is_featured,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
        images: images,
        sizes_quantities: sizes_quantities
      });
    } catch (error) {
      console.error('Error in findBySlug:', error);
      throw error;
    }
  }
}

module.exports = MySQLProductRepository; 