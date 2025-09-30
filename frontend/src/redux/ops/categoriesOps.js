import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("categories");
      const categories = response.data?.data?.categories || [];
      return categories.map((cat) => ({
        ...cat,
        lowerName: cat.name.toLowerCase(),
      }));
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);
