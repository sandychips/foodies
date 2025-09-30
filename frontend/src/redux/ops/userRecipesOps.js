import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserRecipes = createAsyncThunk(
  "recipes/fetchUserRecipes",
  async ({ page = 1, userId }, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("User ID is required");
    }

    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        ownerId: userId,
      });
      const response = await api.get(`recipes?${queryParams.toString()}`);
      const payload = response.data?.data || {};
      return {
        items: payload.recipes || [],
        page: payload.pagination?.page ?? page,
        pages: payload.pagination?.pages ?? 1,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
