import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("testimonials");
      return response.data?.data?.testimonials || [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);
