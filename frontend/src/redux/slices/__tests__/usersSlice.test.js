import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  usersSlice,
  usersReducer,
  resetUsersState,
  clearUsersError,
  openSignInModal,
  closeSignInModal,
  selectUser,
  selectUserToken,
  selectIsSignInOpen,
} from '../usersSlice';
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchMe,
} from '../../ops/usersOps';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('usersSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('initial state', () => {
    it('should have correct initial state when no persisted data', () => {
      const state = usersReducer(undefined, { type: 'unknown' });

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isSignInOpen).toBe(false);
      expect(state.followers).toEqual({
        items: [],
        total: 0,
        isLoading: false,
        error: null,
      });
    });

    it('should load persisted user from localStorage', () => {
      const persistedData = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(persistedData));

      // Re-import to trigger initialization
      vi.resetModules();
    });
  });

  describe('reducers', () => {
    it('should handle resetUsersState', () => {
      const previousState = {
        user: { id: 1, name: 'Test' },
        token: 'token',
        error: 'Some error',
        isLoading: true,
      };

      const state = usersReducer(previousState, resetUsersState());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle clearUsersError', () => {
      const previousState = {
        user: null,
        token: null,
        error: 'Some error',
        isLoading: false,
      };

      const state = usersReducer(previousState, clearUsersError());

      expect(state.error).toBeNull();
    });

    it('should handle openSignInModal', () => {
      const previousState = {
        user: null,
        token: null,
        isSignInOpen: false,
        error: 'Some error',
      };

      const state = usersReducer(previousState, openSignInModal());

      expect(state.isSignInOpen).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle closeSignInModal', () => {
      const previousState = {
        user: null,
        token: null,
        isSignInOpen: true,
      };

      const state = usersReducer(previousState, closeSignInModal());

      expect(state.isSignInOpen).toBe(false);
    });
  });

  describe('extraReducers - registerUser', () => {
    it('should handle registerUser.pending', () => {
      const state = usersReducer(undefined, registerUser.pending());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle registerUser.fulfilled', () => {
      const payload = {
        user: { id: 1, name: 'New User', email: 'new@example.com' },
        token: 'new-token',
      };

      const state = usersReducer(undefined, registerUser.fulfilled(payload));

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.token).toBe(payload.token);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(payload)
      );
    });

    it('should handle registerUser.rejected', () => {
      const error = 'Registration failed';
      const state = usersReducer(
        undefined,
        registerUser.rejected(null, '', undefined, error)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('extraReducers - loginUser', () => {
    it('should handle loginUser.pending', () => {
      const state = usersReducer(undefined, loginUser.pending());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loginUser.fulfilled', () => {
      const payload = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'login-token',
      };

      const state = usersReducer(undefined, loginUser.fulfilled(payload));

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.token).toBe(payload.token);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(payload)
      );
    });

    it('should handle loginUser.rejected', () => {
      const error = 'Login failed';
      const state = usersReducer(
        undefined,
        loginUser.rejected(null, '', undefined, error)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('extraReducers - logoutUser', () => {
    it('should handle logoutUser.fulfilled', () => {
      const previousState = {
        user: { id: 1, name: 'Test' },
        token: 'token',
        isLoading: false,
      };

      const state = usersReducer(previousState, logoutUser.fulfilled());

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('selectors', () => {
    it('should select user', () => {
      const state = {
        users: {
          user: { id: 1, name: 'Test' },
        },
      };

      expect(selectUser(state)).toEqual({ id: 1, name: 'Test' });
    });

    it('should select token', () => {
      const state = {
        users: {
          token: 'test-token',
        },
      };

      expect(selectUserToken(state)).toBe('test-token');
    });

    it('should select isSignInOpen', () => {
      const state = {
        users: {
          isSignInOpen: true,
        },
      };

      expect(selectIsSignInOpen(state)).toBe(true);
    });
  });
});