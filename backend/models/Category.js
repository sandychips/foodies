'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
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
    },
    {
      tableName: 'categories',
      underscored: true,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Recipe, {
      as: 'recipes',
      foreignKey: 'categoryId',
    });
  };

  return Category;
};
