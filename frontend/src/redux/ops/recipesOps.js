import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectRecipesLimit } from "@/redux/slices/recipesSlice.js";
import api from "../../services/api";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchAll",
  async (
    {
      page = 1,
      categoryId = null,
      areaId = null,
      ingredientId = null,
      ownerId = null,
    } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const limit = selectRecipesLimit(state);

      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      if (categoryId) queryParams.append("categoryId", categoryId);
      if (areaId) queryParams.append("areaId", areaId);
      if (ingredientId) queryParams.append("ingredientId", ingredientId);
      if (ownerId) queryParams.append("ownerId", ownerId);

      const response = await api.get(`recipes?${queryParams.toString()}`);
      const payload = response.data?.data || {};

      return {
        recipes: payload.recipes || [],
        pagination: payload.pagination || {
          page,
          limit,
          pages: 1,
          total: payload.recipes?.length || 0,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`recipes/${id}`);
      return response.data?.data?.recipe;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchRecipesPopular = createAsyncThunk(
  "recipes/fetchPopular",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("recipes/popular");
      return response.data?.data?.recipes || [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (recipeFormData, thunkAPI) => {
    try {
      const response = await api.post("recipes", recipeFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data?.recipe;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMyRecipes = createAsyncThunk(
  "recipes/fetchMyRecipes",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("users/own");
      return response.data?.data?.recipes || [];
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchFavoriteRecipes = createAsyncThunk(
  "recipes/fetchFavoriteRecipes",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("users/favorites");
      return response.data?.data?.recipes || [];
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addRecipeToFavorites = createAsyncThunk(
  "recipes/addRecipeToFavorites",
  async (id, thunkAPI) => {
    try {
      await api.post(`recipes/${id}/favorite`);
      await thunkAPI.dispatch(fetchFavoriteRecipes());
      return id;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeRecipe = createAsyncThunk(
  "recipes/removeRecipe",
  async (id, thunkAPI) => {
    try {
      await api.delete(`recipes/${id}`);
      return id;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeRecipeFromFavorites = createAsyncThunk(
  "recipes/removeRecipeFromFavorites",
  async (id, thunkAPI) => {
    try {
      await api.delete(`recipes/${id}/favorite`);
      await thunkAPI.dispatch(fetchFavoriteRecipes());
      return id;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
