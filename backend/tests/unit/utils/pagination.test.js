const { getPagination } = require('../../../utils/pagination');

describe('Pagination Utils', () => {
  test('should return defaults when query is empty', () => {
    const result = getPagination({});
    expect(result).toEqual({ page: 1, limit: 12, offset: 0 });
  });

  test('should clamp page and limit to allowed range', () => {
    const result = getPagination({ page: '-2', limit: '500' });
    expect(result).toEqual({ page: 1, limit: 100, offset: 0 });
  });

  test('should calculate offset based on provided values', () => {
    const result = getPagination({ page: '3', limit: '20' });
    expect(result).toEqual({ page: 3, limit: 20, offset: 40 });
  });

  test('should handle string inputs correctly', () => {
    const result = getPagination({ page: '2', limit: '15' });
    expect(result).toEqual({ page: 2, limit: 15, offset: 15 });
  });

  test('should handle page 1 correctly', () => {
    const result = getPagination({ page: '1', limit: '10' });
    expect(result).toEqual({ page: 1, limit: 10, offset: 0 });
  });
});
