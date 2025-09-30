'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFollower = sequelize.define(
    'UserFollower',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: 'user_followers',
      underscored: true,
    }
  );

  UserFollower.associate = (models) => {
    UserFollower.belongsTo(models.User, {
      as: 'Follower',
      foreignKey: 'followerId',
    });

    UserFollower.belongsTo(models.User, {
      as: 'Following',
      foreignKey: 'followingId',
    });
  };

  return UserFollower;
};
