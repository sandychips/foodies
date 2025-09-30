const { hashPassword, comparePassword } = require('../../../utils/password');

describe('Password Utils', () => {
  describe('hashPassword', () => {
    test('should hash password successfully', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(typeof hashed).toBe('string');
      expect(hashed.length).toBeGreaterThan(0);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    test('should handle empty password', async () => {
      const hashed = await hashPassword('');

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
    });
  });

  describe('comparePassword', () => {
    test('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      const result = await comparePassword(password, hashed);

      expect(result).toBe(true);
    });

    test('should return false for non-matching password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashed = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hashed);

      expect(result).toBe(false);
    });

    test('should return false for empty password against hash', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      const result = await comparePassword('', hashed);

      expect(result).toBe(false);
    });

    test('should be case-sensitive', async () => {
      const password = 'TestPassword123';
      const hashed = await hashPassword(password);
      const result = await comparePassword('testpassword123', hashed);

      expect(result).toBe(false);
    });
  });
});