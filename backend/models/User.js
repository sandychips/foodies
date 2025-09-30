'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'users',
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      as: 'recipes',
      foreignKey: 'ownerId',
    });

    User.belongsToMany(models.User, {
      as: 'followers',
      through: models.UserFollower,
      foreignKey: 'followingId',
      otherKey: 'followerId',
    });

    User.belongsToMany(models.User, {
      as: 'following',
      through: models.UserFollower,
      foreignKey: 'followerId',
      otherKey: 'followingId',
    });

    User.belongsToMany(models.Recipe, {
      as: 'favoriteRecipes',
      through: models.UserFavoriteRecipe,
      foreignKey: 'userId',
      otherKey: 'recipeId',
    });
  };

  return User;
};
