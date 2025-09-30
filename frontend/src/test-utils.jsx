import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { recipesReducer } from '@/redux/slices/recipesSlice';
import { categoriesReducer } from '@/redux/slices/categoriesSlice';
import { areasReducer } from '@/redux/slices/areasSlice';
import { ingredientsReducer } from '@/redux/slices/ingredientsSlice';
import { testimonialsReducer } from '@/redux/slices/testimonialsSlice';
import { usersReducer } from '@/redux/slices/usersSlice';
import { userRecipesReducer } from '@/redux/slices/userResipesSlice';

const rootReducer = {
  recipes: recipesReducer,
  categories: categoriesReducer,
  areas: areasReducer,
  ingredients: ingredientsReducer,
  testimonials: testimonialsReducer,
  users: usersReducer,
  userRecipes: userRecipesReducer,
};

export const setupStore = (preloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export const renderWithProviders = (
  ui,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  } = {},
) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
