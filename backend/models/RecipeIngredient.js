'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecipeIngredient = sequelize.define(
    'RecipeIngredient',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      measure: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'recipe_ingredients',
      underscored: true,
    }
  );

  RecipeIngredient.associate = (models) => {
    RecipeIngredient.belongsTo(models.Recipe, {
      as: 'Recipe',
      foreignKey: 'recipeId',
    });

    RecipeIngredient.belongsTo(models.Ingredient, {
      as: 'Ingredient',
      foreignKey: 'ingredientId',
    });
  };

  return RecipeIngredient;
};
