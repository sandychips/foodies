import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data?.data?.user;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "users/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data?.data;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async (loginData, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", loginData);
      return response.data?.data;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk("users/logout", async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore logout error to keep UX smooth
  }
  return;
});

export const fetchMe = createAsyncThunk(
  "users/fetchMe",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/current");
      return response.data?.data?.user;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "users/updateAvatar",
  async (formData, thunkAPI) => {
    try {
      const response = await api.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data?.user;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserFollowers = createAsyncThunk(
  "users/fetchFollowers",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/users/followers`);
      return response.data?.data;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserFollowees = createAsyncThunk(
  "users/fetchFollowees",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/following");
      return response.data?.data;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const followUser = createAsyncThunk(
  "users/followUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.post(`/users/${id}/follow`);
      return response.data?.data;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "users/unfollowUser",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/users/${id}/unfollow`);
      return response.data?.data;
    } catch (e) {
      const message = e.response?.data?.message || e.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
