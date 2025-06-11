const db = require('../database/db');

class MySQLCategoryRepository {
  async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          id,
          name,
          slug,
          description,
          image_url,
          parent_id,
          is_active,
          display_order,
          created_at,
          updated_at
        FROM categories
        WHERE is_active = TRUE
        ORDER BY display_order ASC, name ASC
      `);

      return rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findFeaturedCategories(limit = 6) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
        WHERE c.is_active = TRUE
        GROUP BY c.id
        ORDER BY product_count DESC
        LIMIT ?
      `, [limit]);

      return rows;
    } catch (error) {
      console.error('Error in findFeaturedCategories:', error);
      throw error;
    }
  }
}

module.exports = MySQLCategoryRepository; 