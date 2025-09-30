import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "../ops/categoriesOps";

const initialState = {
  items: [],
  pagination: null,
  isLoading: false,
  error: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoriesState: (state) => {
      state.items = [];
      state.pagination = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.rejected, handleRejected);
  },
});

export const { resetCategoriesState } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
export const selectCategories = (state) => state.categories.items;
export const selectCategoriesPagination = (state) =>
  state.categories.pagination;
export const selectCategoriesIsLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;
