'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    'Recipe',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumb: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'recipes',
      underscored: true,
    }
  );

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId',
    });

    Recipe.belongsTo(models.Area, {
      as: 'area',
      foreignKey: 'areaId',
    });

    Recipe.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'ownerId',
    });

    Recipe.belongsToMany(models.Ingredient, {
      through: models.RecipeIngredient,
      as: 'ingredients',
      foreignKey: 'recipeId',
      otherKey: 'ingredientId',
    });

    Recipe.belongsToMany(models.User, {
      through: models.UserFavoriteRecipe,
      as: 'likedBy',
      foreignKey: 'recipeId',
      otherKey: 'userId',
    });
  };

  return Recipe;
};
