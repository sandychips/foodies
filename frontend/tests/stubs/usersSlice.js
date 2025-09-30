import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  followers: { items: [], total: 0, isLoading: false, error: null },
  followees: { items: [], total: 0, isLoading: false, error: null },
  profileUser: null,
  isLoading: false,
  error: null,
  isSignInOpen: false,
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    openSignInModal: (state) => {
      state.isSignInOpen = true;
    },
  },
});

export const { openSignInModal } = slice.actions;
export const selectUser = (state) => state.users.user;
export default slice.reducer;
