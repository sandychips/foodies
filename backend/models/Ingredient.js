'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define(
    'Ingredient',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'ingredients',
      underscored: true,
    }
  );

  Ingredient.associate = (models) => {
    Ingredient.belongsToMany(models.Recipe, {
      through: models.RecipeIngredient,
      as: 'recipes',
      foreignKey: 'ingredientId',
      otherKey: 'recipeId',
    });
  };

  return Ingredient;
};
