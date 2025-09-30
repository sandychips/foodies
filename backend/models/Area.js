'use strict';
module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define(
    'Area',
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
      tableName: 'areas',
      underscored: true,
    }
  );

  Area.associate = (models) => {
    Area.hasMany(models.Recipe, {
      as: 'recipes',
      foreignKey: 'areaId',
    });
  };

  return Area;
};
