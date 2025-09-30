'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFavoriteRecipe = sequelize.define(
    'UserFavoriteRecipe',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: 'user_favorite_recipes',
      underscored: true,
    }
  );

  UserFavoriteRecipe.associate = (models) => {
    UserFavoriteRecipe.belongsTo(models.User, {
      as: 'User',
      foreignKey: 'userId',
    });

    UserFavoriteRecipe.belongsTo(models.Recipe, {
      as: 'Recipe',
      foreignKey: 'recipeId',
    });
  };

  return UserFavoriteRecipe;
};
