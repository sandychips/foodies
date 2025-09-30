import { createSlice } from "@reduxjs/toolkit";
import { fetchAreas } from "../ops/areasOps";

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

export const areasSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {
    resetAreasState: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, handlePending)
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAreas.rejected, handleRejected);
  },
});

export const { resetAreasState } = areasSlice.actions;
export const areasReducer = areasSlice.reducer;
export const selectAreas = (state) => state.areas.items;
export const selectAreasIsLoading = (state) => state.areas.isLoading;
export const selectAreasError = (state) => state.areas.error;
