'use strict';

const fs = require('fs');
const path = require('path');
const { v5: uuidv5 } = require('uuid');

const ingredientsPath = path.resolve(__dirname, '../../foodiesjson/ingredients.json');
const NAMESPACE = '323e4567-e89b-12d3-a456-426614174000';

module.exports = {
  async up(queryInterface) {
    const data = JSON.parse(fs.readFileSync(ingredientsPath, 'utf-8'));

    const records = data.map((item) => ({
      id: uuidv5(item._id, NAMESPACE),
      name: item.name,
      description: item.desc || null,
      image: item.img || null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('ingredients', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ingredients', null, {});
  },
};
