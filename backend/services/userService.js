const {
  User,
  Recipe,
  UserFollower,
  UserFavoriteRecipe,
} = require('../models');

const getUserStats = async (userId) => {
  const [recipesCount, favoritesCount, followersCount, followingCount] = await Promise.all([
    Recipe.count({ where: { ownerId: userId } }),
    UserFavoriteRecipe.count({ where: { userId } }),
    UserFollower.count({ where: { followingId: userId } }),
    UserFollower.count({ where: { followerId: userId } }),
  ]);

  return {
    recipesCount,
    favoritesCount,
    followersCount,
    followingCount,
  };
};

const getUserProfileWithStats = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'avatar', 'createdAt'],
  });
  if (!user) {
    return null;
  }

  const stats = await getUserStats(userId);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    stats,
  };
};

const isFollowing = async (followerId, followingId) => {
  if (!followerId || !followingId) {
    return false;
  }
  const record = await UserFollower.findOne({
    where: { followerId, followingId },
  });
  return Boolean(record);
};

module.exports = {
  getUserProfileWithStats,
  isFollowing,
};
