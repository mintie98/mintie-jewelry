const db = require('../models/db');

exports.getProductImages = async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC',
      [productId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

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
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS image,
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
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};
