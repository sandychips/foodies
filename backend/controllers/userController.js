const {
  User,
  UserFollower,
  Recipe,
  UserFavoriteRecipe,
} = require('../models');
const { success } = require('../utils/apiResponse');
const { getUserProfileWithStats, isFollowing } = require('../services/userService');
const { uploadBuffer, isConfigured } = require('../utils/cloudinary');

const getCurrentUser = async (req, res, next) => {
  try {
    const result = await getUserProfileWithStats(req.user.id);
    if (!result) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return success(res, { user: result }, 'Current user fetched');
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const target = await getUserProfileWithStats(id);
    if (!target) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const following = await isFollowing(req.user?.id, id);
    return success(res, { user: { ...target, isFollowing: following } }, 'User fetched');
  } catch (err) {
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('Avatar file is required');
      err.status = 400;
      throw err;
    }

    let avatarUrl;
    if (isConfigured) {
      const uploadResult = await uploadBuffer(req.file.buffer, {
        folder: 'foodies/avatars',
        resource_type: 'image',
      });
      avatarUrl = uploadResult.secure_url;
    } else {
      avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await User.update({ avatar: avatarUrl }, { where: { id: req.user.id } });
    return success(res, { user: { id: req.user.id, avatar: avatarUrl } }, 'Avatar updated');
  } catch (err) {
    return next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { id } = req.user;
    const followers = await UserFollower.findAll({
      where: { followingId: id },
      include: [
        {
          model: User,
          as: 'Follower',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    const payload = followers
      .filter((item) => Boolean(item.Follower))
      .map((item) => ({
        id: item.Follower.id,
        name: item.Follower.name,
        avatar: item.Follower.avatar,
      }));

    return success(res, { followers: payload, total: payload.length }, 'Followers fetched');
  } catch (err) {
    return next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { id } = req.user;
    const following = await UserFollower.findAll({
      where: { followerId: id },
      include: [
        {
          model: User,
          as: 'Following',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    const payload = following
      .filter((item) => Boolean(item.Following))
      .map((item) => ({
        id: item.Following.id,
        name: item.Following.name,
        avatar: item.Following.avatar,
      }));

    return success(res, { following: payload, total: payload.length }, 'Following fetched');
  } catch (err) {
    return next(err);
  }
};

const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { id: followingId } = req.params;

    if (followerId === followingId) {
      const err = new Error('You cannot follow yourself');
      err.status = 400;
      throw err;
    }

    const target = await User.findByPk(followingId);
    if (!target) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const exists = await UserFollower.findOne({ where: { followerId, followingId } });
    if (exists) {
      return success(res, {}, 'Already following');
    }

    await UserFollower.create({ followerId, followingId });
    return success(res, {}, 'Followed user', 201);
  } catch (err) {
    return next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { id: followingId } = req.params;

    const target = await User.findByPk(followingId);
    if (!target) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    await UserFollower.destroy({ where: { followerId, followingId } });
    return success(res, {}, 'Unfollowed user');
  } catch (err) {
    return next(err);
  }
};

const getOwnRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return success(res, { recipes }, 'Own recipes fetched');
  } catch (err) {
    return next(err);
  }
};

const getFavoriteRecipes = async (req, res, next) => {
  try {
    const favorites = await UserFavoriteRecipe.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Recipe,
          as: 'Recipe',
        },
      ],
    });

    const payload = favorites
      .filter((item) => Boolean(item.Recipe))
      .map((item) => item.Recipe);

    return success(res, { recipes: payload }, 'Favorite recipes fetched');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  updateAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  getOwnRecipes,
  getFavoriteRecipes,
};
