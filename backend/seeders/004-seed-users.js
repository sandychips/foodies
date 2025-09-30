'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v5: uuidv5 } = require('uuid');

const usersPath = path.resolve(__dirname, '../../foodiesjson/users.json');
const NAMESPACE = '423e4567-e89b-12d3-a456-426614174000';
const PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const extractId = (item) => item._id?.$oid || item._id || item.id;

module.exports = {
  async up(queryInterface) {
    const data = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

    const records = data.map((item) => ({
      id: uuidv5(extractId(item), NAMESPACE),
      name: item.name,
      email: item.email,
      password: PASSWORD_HASH,
      avatar: item.avatar || null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('users', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
