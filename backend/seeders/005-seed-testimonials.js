'use strict';

const fs = require('fs');
const path = require('path');
const { v5: uuidv5 } = require('uuid');

const testimonialsPath = path.resolve(__dirname, '../../foodiesjson/testimonials.json');
const usersPath = path.resolve(__dirname, '../../foodiesjson/users.json');
const NAMESPACE = '523e4567-e89b-12d3-a456-426614174000';
const USER_NAMESPACE = '423e4567-e89b-12d3-a456-426614174000';

const getUserMap = () => {
  const raw = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  return raw.reduce((acc, item) => {
    const sourceId = item._id?.$oid || item._id || item.id;
    const id = uuidv5(sourceId, USER_NAMESPACE);
    acc[sourceId] = { id, name: item.name || 'Foodies User', avatar: item.avatar || null };
    return acc;
  }, {});
};

module.exports = {
  async up(queryInterface) {
    const testimonials = JSON.parse(fs.readFileSync(testimonialsPath, 'utf-8'));
    const userMap = getUserMap();

    const records = testimonials.map((item) => {
      const sourceOwner = item.owner?.$oid || item.owner || null;
      const user = sourceOwner ? userMap[sourceOwner] : null;
      return {
        id: uuidv5(item._id?.$oid || item._id || item.id, NAMESPACE),
        user_name: user?.name || 'Foodies User',
        user_avatar: user?.avatar || null,
        content: item.testimonial,
        rating: 5,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert('testimonials', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('testimonials', null, {});
  },
};
