import { createSlice } from "@reduxjs/toolkit";
import { fetchTestimonials } from "../ops/testimonialsOps";

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

export const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    resetTestimonialsState: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, handlePending)
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTestimonials.rejected, handleRejected);
  },
});

export const { resetTestimonialsState } = testimonialsSlice.actions;
export const testimonialsReducer = testimonialsSlice.reducer;
export const selectTestimonials = (state) => state.testimonials.items;
export const selectTestimonialsIsLoading = (state) =>
  state.testimonials.isLoading;
export const selectTestimonialsError = (state) => state.testimonials.error;
