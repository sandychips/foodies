import { createSlice } from "@reduxjs/toolkit";
import { fetchUserRecipes } from "../ops/userRecipesOps";

const defaultUserRecipesState = {
  items: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

export const userRecipesSlice = createSlice({
  name: "userRecipes",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRecipes.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!userId) return;
        state[userId] = {
          ...(state[userId] || defaultUserRecipesState),
          isLoading: true,
          error: null,
        };
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!userId) return;
        state[userId] = {
          items: action.payload.items,
          isLoading: false,
          error: null,
          page: action.payload.page,
          totalPages: action.payload.pages,
        };
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!userId) return;
        state[userId] = {
          ...(state[userId] || defaultUserRecipesState),
          isLoading: false,
          error: action.payload,
        };
      });
  },
});

export const userRecipesReducer = userRecipesSlice.reducer;

export const selectUserRecipes = (userId) => (state) =>
  state.userRecipes[userId]?.items ?? [];
export const selectUserRecipesPage = (userId) => (state) =>
  state.userRecipes[userId]?.page ?? 1;
export const selectUserRecipesTotalPages = (userId) => (state) =>
  state.userRecipes[userId]?.totalPages ?? 1;
export const selectUserRecipesError = (userId) => (state) =>
  state.userRecipes[userId]?.error ?? null;
export const selectUserRecipesIsLoading = (userId) => (state) =>
  state.userRecipes[userId]?.isLoading ?? false;
