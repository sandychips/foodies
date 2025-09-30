import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./slices/usersSlice";
import { recipesReducer } from "./slices/recipesSlice";
import { categoriesReducer } from "./slices/categoriesSlice";
import { areasReducer } from "./slices/areasSlice";
import { ingredientsReducer } from "./slices/ingredientsSlice";
import { testimonialsReducer } from "./slices/testimonialsSlice";
import { userRecipesReducer } from "./slices/userResipesSlice";

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    categories: categoriesReducer,
    areas: areasReducer,
    ingredients: ingredientsReducer,
    testimonials: testimonialsReducer,
    users: usersReducer,
    userRecipes: userRecipesReducer,
  },
});
