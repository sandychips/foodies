const jwtLib = require('jsonwebtoken');
const { signAccessToken, signRefreshToken } = require('../../../utils/jwt');

describe('JWT Utils', () => {
  const mockPayload = { id: 1, email: 'test@example.com' };

  describe('signAccessToken', () => {
    test('should generate access token with correct payload', () => {
      const token = signAccessToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwtLib.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    test('should set expiration time correctly', () => {
      const token = signAccessToken(mockPayload);
      const decoded = jwtLib.verify(token, process.env.JWT_SECRET);

      const lifetime = decoded.exp - decoded.iat;
      expect(lifetime).toBe(60 * 60); // 1 hour from setup.js
    });

    test('should generate different tokens for different payloads', () => {
      const payload1 = { id: 1, email: 'user1@example.com' };
      const payload2 = { id: 2, email: 'user2@example.com' };

      const token1 = signAccessToken(payload1);
      const token2 = signAccessToken(payload2);

      expect(token1).not.toBe(token2);

      const decoded1 = jwtLib.verify(token1, process.env.JWT_SECRET);
      const decoded2 = jwtLib.verify(token2, process.env.JWT_SECRET);

      expect(decoded1.id).toBe(1);
      expect(decoded2.id).toBe(2);
    });
  });

  describe('signRefreshToken', () => {
    test('should generate refresh token with correct payload', () => {
      const token = signRefreshToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwtLib.verify(token, process.env.REFRESH_TOKEN_SECRET);
      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    test('should use refresh token secret', () => {
      const token = signRefreshToken(mockPayload);

      // Should fail with access token secret
      expect(() => {
        jwtLib.verify(token, process.env.JWT_SECRET);
      }).toThrow();

      // Should succeed with refresh token secret
      const decoded = jwtLib.verify(token, process.env.REFRESH_TOKEN_SECRET);
      expect(decoded.id).toBe(mockPayload.id);
    });

    test('should set longer expiration than access token', () => {
      const accessToken = signAccessToken(mockPayload);
      const refreshToken = signRefreshToken(mockPayload);

      const decodedAccess = jwtLib.verify(accessToken, process.env.JWT_SECRET);
      const decodedRefresh = jwtLib.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const accessLifetime = decodedAccess.exp - decodedAccess.iat;
      const refreshLifetime = decodedRefresh.exp - decodedRefresh.iat;

      expect(refreshLifetime).toBeGreaterThan(accessLifetime);
    });
  });
});