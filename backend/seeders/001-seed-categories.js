'use strict';

const fs = require('fs');
const path = require('path');
const { v5: uuidv5 } = require('uuid');

const categoriesPath = path.resolve(__dirname, '../../foodiesjson/categories.json');
const NAMESPACE = '123e4567-e89b-12d3-a456-426614174000';

module.exports = {
  async up(queryInterface) {
    const data = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

    const records = data.map((item) => ({
      id: uuidv5(item.name, NAMESPACE),
      name: item.name,
      description: item.description || null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('categories', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
