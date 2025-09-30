import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites } from '@/redux/slices/recipesSlice';
import { addRecipeToFavorites, removeRecipeFromFavorites } from '@/redux/ops/recipesOps';
import { openSignInModal, selectUser } from '@/redux/slices/usersSlice.js';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const user = useSelector(selectUser);

  const isInFavorites = (recipe) =>
    Boolean(user) && favorites?.some((fav) => fav.id === recipe.id);

  const toggleFavorite = (recipe) => {
    if (!user) {
      dispatch(openSignInModal());
      return;
    }

    if (!recipe?.id) {
      return;
    }

    if (isInFavorites(recipe)) {
      dispatch(removeRecipeFromFavorites(recipe.id));
    } else {
      dispatch(addRecipeToFavorites(recipe.id));
    }
  };

  return {
    favorites,
    isInFavorites,
    toggleFavorite,
  };
};
