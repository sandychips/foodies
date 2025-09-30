// Mock models before requiring service
jest.mock('../../../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  Recipe: {
    count: jest.fn(),
  },
  UserFollower: {
    count: jest.fn(),
    findOne: jest.fn(),
  },
  UserFavoriteRecipe: {
    count: jest.fn(),
  },
}));

const {
  getUserProfileWithStats,
  isFollowing,
} = require('../../../services/userService');
const {
  User,
  Recipe,
  UserFollower,
  UserFavoriteRecipe,
} = require('../../../models');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfileWithStats', () => {
    test('should return null if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await getUserProfileWithStats(999);

      expect(result).toBeNull();
      expect(User.findByPk).toHaveBeenCalledWith(999, {
        attributes: ['id', 'name', 'email', 'avatar', 'createdAt'],
      });
    });

    test('should return user profile with stats', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-01'),
      };

      User.findByPk.mockResolvedValue(mockUser);
      // Mock count calls - these will be called in Promise.all
      Recipe.count.mockImplementation((options) => {
        if (options.where.ownerId === 1) return Promise.resolve(5);
        return Promise.resolve(0);
      });
      UserFavoriteRecipe.count.mockImplementation((options) => {
        if (options.where.userId === 1) return Promise.resolve(10);
        return Promise.resolve(0);
      });
      UserFollower.count.mockImplementation((options) => {
        if (options.where.followingId === 1) return Promise.resolve(15);
        if (options.where.followerId === 1) return Promise.resolve(20);
        return Promise.resolve(0);
      });

      const result = await getUserProfileWithStats(1);

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
        createdAt: mockUser.createdAt,
        stats: {
          recipesCount: 5,
          favoritesCount: 10,
          followersCount: 15,
          followingCount: 20,
        },
      });

      expect(Recipe.count).toHaveBeenCalledWith({ where: { ownerId: 1 } });
      expect(UserFavoriteRecipe.count).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(UserFollower.count).toHaveBeenCalledWith({ where: { followingId: 1 } });
      expect(UserFollower.count).toHaveBeenCalledWith({ where: { followerId: 1 } });
    });

    test('should handle database errors gracefully', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(getUserProfileWithStats(1)).rejects.toThrow('Database error');
    });
  });

  describe('isFollowing', () => {
    test('should return false if followerId is missing', async () => {
      const result = await isFollowing(null, 2);

      expect(result).toBe(false);
      expect(UserFollower.findOne).not.toHaveBeenCalled();
    });

    test('should return false if followingId is missing', async () => {
      const result = await isFollowing(1, null);

      expect(result).toBe(false);
      expect(UserFollower.findOne).not.toHaveBeenCalled();
    });

    test('should return false if no follow relationship exists', async () => {
      UserFollower.findOne.mockResolvedValue(null);

      const result = await isFollowing(1, 2);

      expect(result).toBe(false);
      expect(UserFollower.findOne).toHaveBeenCalledWith({
        where: { followerId: 1, followingId: 2 },
      });
    });

    test('should return true if follow relationship exists', async () => {
      UserFollower.findOne.mockResolvedValue({ followerId: 1, followingId: 2 });

      const result = await isFollowing(1, 2);

      expect(result).toBe(true);
      expect(UserFollower.findOne).toHaveBeenCalledWith({
        where: { followerId: 1, followingId: 2 },
      });
    });
  });
});