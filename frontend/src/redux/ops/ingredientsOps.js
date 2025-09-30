import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchIngredients = createAsyncThunk(
  "ingredients/fetchAll",
  async (_, thunkAPI) => {
    try {
      const limit = 100;
      let page = 1;
      let totalPages = 1;
      const collected = [];

      do {
        const response = await api.get("ingredients", {
          params: { page, limit },
        });
        const data = response.data?.data;
        collected.push(...(data?.ingredients || []));
        totalPages = data?.pagination?.pages || 1;
        page += 1;
      } while (page <= totalPages);

      return collected;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);
