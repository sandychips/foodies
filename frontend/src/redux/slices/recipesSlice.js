import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRecipes,
  fetchRecipeById,
  fetchRecipesPopular,
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  fetchFavoriteRecipes,
  removeRecipe,
  fetchMyRecipes,
  createRecipe,
} from "../ops/recipesOps";

const initialState = {
  items: [],
  pagination: {
    page: 1,
    pages: 1,
    limit: 8,
    total: 0,
  },
  filters: {
    categoryId: null,
    areaId: null,
    ingredientId: null,
  },
  currentRecipe: null,
  favorites: [],
  ownRecipes: [],
  popularRecipes: [],
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

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    resetRecipesState: () => ({ ...initialState }),
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setSelectedCategoryId: (state, action) => {
      state.filters.categoryId = action.payload;
    },
    setSelectedAreaId: (state, action) => {
      state.filters.areaId = action.payload;
    },
    setSelectedIngredientId: (state, action) => {
      state.filters.ingredientId = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, handlePending)
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.recipes;
        state.pagination = {
          page: action.payload.pagination.page ?? 1,
          pages: action.payload.pagination.pages ?? 1,
          limit: action.payload.pagination.limit ?? state.pagination.limit,
          total: action.payload.pagination.total ?? action.payload.recipes.length,
        };
      })
      .addCase(fetchRecipes.rejected, handleRejected)

      .addCase(fetchRecipeById.pending, handlePending)
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, handleRejected)

      .addCase(fetchRecipesPopular.fulfilled, (state, action) => {
        state.popularRecipes = action.payload;
      })

      .addCase(createRecipe.pending, handlePending)
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(createRecipe.rejected, handleRejected)

      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoriteRecipes.rejected, handleRejected)

      .addCase(addRecipeToFavorites.pending, handlePending)
      .addCase(addRecipeToFavorites.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addRecipeToFavorites.rejected, handleRejected)

      .addCase(removeRecipeFromFavorites.pending, handlePending)
      .addCase(removeRecipeFromFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = state.favorites.filter((recipe) => recipe.id !== action.payload);
      })
      .addCase(removeRecipeFromFavorites.rejected, handleRejected)

      .addCase(removeRecipe.pending, handlePending)
      .addCase(removeRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((recipe) => recipe.id !== action.payload);
        state.ownRecipes = state.ownRecipes.filter((recipe) => recipe.id !== action.payload);
      })
      .addCase(removeRecipe.rejected, handleRejected)

      .addCase(fetchMyRecipes.pending, handlePending)
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ownRecipes = action.payload;
      })
      .addCase(fetchMyRecipes.rejected, handleRejected);
  },
});

export const {
  resetRecipesState,
  setPage,
  setSelectedCategoryId,
  setSelectedAreaId,
  setSelectedIngredientId,
  clearFavorites,
} = recipesSlice.actions;

export const recipesReducer = recipesSlice.reducer;

export const selectRecipes = (state) => state.recipes.items;
export const selectCurrentRecipe = (state) => state.recipes.currentRecipe;
export const selectRecipesIsLoading = (state) => state.recipes.isLoading;
export const selectRecipesError = (state) => state.recipes.error;
export const selectFavorites = (state) => state.recipes.favorites;
export const selectFavoritesTotalPages = () => 1;
export const selectFavoritesPage = () => 1;
export const selectFavoritesIsLoading = (state) => state.recipes.isLoading;
export const selectFavoritesError = (state) => state.recipes.error;
export const selectOwnRecipes = (state) => state.recipes.ownRecipes;
export const selectRecipesPage = (state) => state.recipes.pagination.page;
export const selectRecipesTotalPages = (state) => state.recipes.pagination.pages;
export const selectRecipesLimit = (state) => state.recipes.pagination.limit;
export const selectPopularRecipes = (state) => state.recipes.popularRecipes;
export const selectSelectedCategory = (state) => state.recipes.filters.categoryId;
export const selectSelectedArea = (state) => state.recipes.filters.areaId;
export const selectSelectedIngredients = (state) =>
  state.recipes.filters.ingredientId ? [state.recipes.filters.ingredientId] : [];
