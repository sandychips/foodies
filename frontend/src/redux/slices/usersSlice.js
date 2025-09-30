import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserById,
  registerUser,
  loginUser,
  logoutUser,
  fetchMe,
  updateUserAvatar,
  fetchUserFollowers,
  fetchUserFollowees,
  followUser,
  unfollowUser,
} from "../ops/usersOps";

const getEmptyListState = () => ({
  items: [],
  total: 0,
  isLoading: false,
  error: null,
});

const loadPersistedUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user && parsed?.token) return parsed;
    localStorage.removeItem("user");
    return null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const saved = loadPersistedUser();

const initialState = {
  user: saved?.user || null,
  token: saved?.token || null,
  followers: getEmptyListState(),
  followees: getEmptyListState(),
  profileUser: null,
  isLoading: false,
  error: null,
  isSignInOpen: false,
};

const setAuthData = (state, payload) => {
  const { user, token } = payload || {};
  state.user = user || null;
  state.token = token || null;
  if (user && token) {
    localStorage.setItem("user", JSON.stringify({ user, token }));
  } else {
    localStorage.removeItem("user");
  }
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsersState: () => ({ ...initialState, followers: getEmptyListState(), followees: getEmptyListState() }),
    clearUsersError: (state) => {
      state.error = null;
    },
    openSignInModal: (state) => {
      state.isSignInOpen = true;
      state.error = null;
    },
    closeSignInModal: (state) => {
      state.isSignInOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, handlePending)
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileUser = action.payload;
      })
      .addCase(fetchUserById.rejected, handleRejected)

      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        setAuthData(state, action.payload);
      })
      .addCase(registerUser.rejected, handleRejected)

      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        setAuthData(state, action.payload);
      })
      .addCase(loginUser.rejected, handleRejected)

      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        setAuthData(state, {});
        state.followers = getEmptyListState();
        state.followees = getEmptyListState();
      })
      .addCase(logoutUser.rejected, handleRejected)

      .addCase(fetchMe.pending, handlePending)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          const persisted = localStorage.getItem("user");
          if (persisted) {
            const parsed = JSON.parse(persisted);
            localStorage.setItem("user", JSON.stringify({ user: action.payload, token: parsed.token }));
          }
        }
      })
      .addCase(fetchMe.rejected, handleRejected)

      .addCase(updateUserAvatar.pending, handlePending)
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user && action.payload) {
          state.user = { ...state.user, avatar: action.payload.avatar };
          const persisted = localStorage.getItem("user");
          if (persisted) {
            const parsed = JSON.parse(persisted);
            localStorage.setItem("user", JSON.stringify({ user: state.user, token: parsed.token }));
          }
        }
      })
      .addCase(updateUserAvatar.rejected, handleRejected)

      .addCase(fetchUserFollowers.pending, (state) => {
        state.followers.isLoading = true;
        state.followers.error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.followers.isLoading = false;
        state.followers.items = action.payload?.followers || [];
        state.followers.total = action.payload?.total || state.followers.items.length;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.followers.isLoading = false;
        state.followers.error = action.payload;
      })

      .addCase(fetchUserFollowees.pending, (state) => {
        state.followees.isLoading = true;
        state.followees.error = null;
      })
      .addCase(fetchUserFollowees.fulfilled, (state, action) => {
        state.followees.isLoading = false;
        state.followees.items = action.payload?.following || [];
        state.followees.total = action.payload?.total || state.followees.items.length;
      })
      .addCase(fetchUserFollowees.rejected, (state, action) => {
        state.followees.isLoading = false;
        state.followees.error = action.payload;
      })

      .addCase(followUser.pending, handlePending)
      .addCase(followUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(followUser.rejected, handleRejected)

      .addCase(unfollowUser.pending, handlePending)
      .addCase(unfollowUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unfollowUser.rejected, handleRejected);
  },
});

export const {
  resetUsersState,
  clearUsersError,
  openSignInModal,
  closeSignInModal,
} = usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const selectUser = (state) => state.users.user;
export const selectProfileUser = (state) => state.users.profileUser;
export const selectUserToken = (state) => state.users.token;
export const selectUsersIsLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;
export const selectIsSignInOpen = (state) => state.users.isSignInOpen;

export const selectUserFollowers = (state) => state.users.followers.items;
export const selectUserFollowersTotalPages = () => 1;
export const selectUserFollowersPage = () => 1;
export const selectUserFollowersIsLoading = (state) => state.users.followers.isLoading;
export const selectUserFollowersError = (state) => state.users.followers.error;

export const selectUserFollowees = (state) => state.users.followees.items;
export const selectUserFolloweesTotalPages = () => 1;
export const selectUserFolloweesPage = () => 1;
export const selectUserFolloweesIsLoading = (state) => state.users.followees.isLoading;
export const selectUserFolloweesError = (state) => state.users.followees.error;
