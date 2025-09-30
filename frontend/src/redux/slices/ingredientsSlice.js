import { createSlice } from "@reduxjs/toolkit";
import { fetchIngredients } from "../ops/ingredientsOps";

const initialState = {
  items: [],
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

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    resetIngredientsState: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, handlePending)
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, handleRejected);
  },
});

export const { resetIngredientsState } = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
export const selectIngredients = (state) => state.ingredients.items;
export const selectIngredientsIsLoading = (state) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state) => state.ingredients.error;
