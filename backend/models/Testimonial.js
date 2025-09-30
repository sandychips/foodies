'use strict';
module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define(
    'Testimonial',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userAvatar: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
    },
    {
      tableName: 'testimonials',
      underscored: true,
    }
  );

  return Testimonial;
};
