'use strict';

const fs = require('fs');
const path = require('path');
const { v5: uuidv5 } = require('uuid');

const recipesPath = path.resolve(__dirname, '../../foodiesjson/recipes.json');
const categoriesNamespace = '123e4567-e89b-12d3-a456-426614174000';
const areasNamespace = '223e4567-e89b-12d3-a456-426614174000';
const ingredientsNamespace = '323e4567-e89b-12d3-a456-426614174000';
const usersNamespace = '423e4567-e89b-12d3-a456-426614174000';
const recipesNamespace = '623e4567-e89b-12d3-a456-426614174000';

const toUuid = (value, namespace) => uuidv5(String(value), namespace);

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

      const recipeRecords = [];
      const ingredientRecords = [];

      recipes.forEach((item) => {
        const recipeId = toUuid(item._id?.$oid || item._id || item.id, recipesNamespace);
        const categoryId = toUuid(item.category, categoriesNamespace);
        const areaId = toUuid(item.area, areasNamespace);
        const ownerId = toUuid(item.owner?.$oid || item.owner, usersNamespace);

        recipeRecords.push({
          id: recipeId,
          title: item.title,
          description: item.description || null,
          instructions: item.instructions,
          time: Number(item.time) || 0,
          thumb: item.thumb || null,
          category_id: categoryId,
          area_id: areaId,
          owner_id: ownerId,
          created_at: new Date(),
          updated_at: new Date(),
        });

        if (Array.isArray(item.ingredients)) {
          item.ingredients.forEach((ingredient) => {
            const ingredientId = toUuid(ingredient.id, ingredientsNamespace);
            ingredientRecords.push({
              id: toUuid(`${recipeId}-${ingredientId}`, '723e4567-e89b-12d3-a456-426614174000'),
              recipe_id: recipeId,
              ingredient_id: ingredientId,
              measure: ingredient.measure || null,
              created_at: new Date(),
              updated_at: new Date(),
            });
          });
        }
      });

      await queryInterface.bulkInsert('recipes', recipeRecords, { transaction });
      if (ingredientRecords.length > 0) {
        await queryInterface.bulkInsert('recipe_ingredients', ingredientRecords, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('recipe_ingredients', null, {});
    await queryInterface.bulkDelete('recipes', null, {});
  },
};
