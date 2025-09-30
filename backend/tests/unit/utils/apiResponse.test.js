const { success, error } = require('../../../utils/apiResponse');
const httpMocks = require('node-mocks-http');

describe('API Response Utils', () => {
  describe('success', () => {
    test('should format a successful response payload', () => {
      const res = httpMocks.createResponse();

      success(res, { id: 7 }, 'Created', 201);

      expect(res.statusCode).toBe(201);
      const data = res._getJSONData();
      expect(data).toEqual({
        success: true,
        message: 'Created',
        data: { id: 7 },
      });
    });

    test('should default to status 200 if not provided', () => {
      const res = httpMocks.createResponse();

      success(res, { test: 'data' }, 'Success');

      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Success');
    });

    test('should handle empty data', () => {
      const res = httpMocks.createResponse();

      success(res, {}, 'No content');

      const data = res._getJSONData();
      expect(data.data).toEqual({});
    });
  });

  describe('error', () => {
    test('should format an error response with optional errors field', () => {
      const res = httpMocks.createResponse();
      const details = { field: 'email' };

      error(res, 'Bad Request', 400, details);

      expect(res.statusCode).toBe(400);
      const data = res._getJSONData();
      expect(data).toEqual({
        success: false,
        message: 'Bad Request',
        errors: details,
      });
    });

    test('should fall back to defaults when not provided', () => {
      const res = httpMocks.createResponse();

      error(res);

      expect(res.statusCode).toBe(500);
      const data = res._getJSONData();
      expect(data).toEqual({
        success: false,
        message: 'Something went wrong',
      });
    });

    test('should not include errors field if not provided', () => {
      const res = httpMocks.createResponse();

      error(res, 'Not found', 404);

      const data = res._getJSONData();
      expect(data.errors).toBeUndefined();
      expect(data.message).toBe('Not found');
    });
  });
});
