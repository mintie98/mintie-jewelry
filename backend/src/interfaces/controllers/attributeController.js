const db = require('../../infrastructure/database/db');

class AttributeController {
  async getAllAttributes(req, res) {
    try {
      console.log('Fetching all attributes...');
      
      const [attributes] = await db.query(`
        SELECT 
          a.id,
          a.name,
          a.display_name,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', av.id,
                'value', av.value
              )
            )
            FROM attribute_values av
            WHERE av.attribute_id = a.id
            ORDER BY av.display_order, av.value
          ) as values
        FROM attributes a
        ORDER BY a.display_name
      `);

      console.log('Raw attributes:', attributes);

      // Parse JSON strings in values
      const parsedAttributes = attributes.map(attr => {
        try {
          return {
            ...attr,
            values: JSON.parse(attr.values || '[]')
          };
        } catch (e) {
          console.error('Error parsing values for attribute:', attr.id, e);
          return {
            ...attr,
            values: []
          };
        }
      });

      console.log('Parsed attributes:', parsedAttributes);
      res.json(parsedAttributes);
    } catch (error) {
      console.error('Error in getAllAttributes:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = new AttributeController(); 