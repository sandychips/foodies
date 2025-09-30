import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { selectPopularRecipes } from '@/redux/slices/recipesSlice'
import { fetchRecipesPopular } from '@/redux/ops/recipesOps'
import { useFavorites } from '@/hooks/useFavorites';
import RecipeCard from '../RecipeCard/RecipeCard';

import css from './PopularRecipes.module.css';
import { openSignInModal, selectUser } from '@/redux/slices/usersSlice.js'

const PopularRecipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popularRecipes = useSelector(selectPopularRecipes);
  const user = useSelector(selectUser);
  const { isInFavorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!popularRecipes?.length) {
      dispatch(fetchRecipesPopular());
    }
  }, [popularRecipes, dispatch]);

  const handleAuthorClick = (author) => {
    if (user) {
      navigate(`/user/${author.id}`);
    } else {
      dispatch(openSignInModal());
    }
  };

  const handleDetailsClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`)
  };

  if (!Array.isArray(popularRecipes) || !popularRecipes.length) {
    return (
      <div className={css.container}>
        <h3 className={css.title}>POPULAR RECIPES</h3>
        <p>No popular recipes found.</p>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <h3 className={css.title}>POPULAR RECIPES</h3>
      <div className={css.list}>
        {popularRecipes.map(recipe => {
          if (!recipe?.id) return null;

          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              author={recipe.user}
              isFavorite={isInFavorites(recipe)}
              onFavoriteToggle={() => toggleFavorite(recipe)}
              onAuthorClick={() => handleAuthorClick(recipe.user)}
              onDetailsClick={() => handleDetailsClick(recipe)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PopularRecipes;
