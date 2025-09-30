import RecipeFilters from "../RecipeFilters/RecipeFilters";
import RecipeList from "../RecipeList/RecipeList";
import RecipePagination from "../RecipePagination/RecipePagination";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { selectIngredients } from '@/redux/slices/ingredientsSlice.js'
import { selectAreas } from '@/redux/slices/areasSlice.js'
import { fetchFavoriteRecipes, fetchRecipes } from '@/redux/ops/recipesOps'
import { selectFavorites, selectRecipes } from '@/redux/slices/recipesSlice'
import css from "./Recipes.module.css";
import { openSignInModal, selectUser } from '@/redux/slices/usersSlice.js'

const Recipes = ({ category, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ingredients = useSelector(selectIngredients);
  const regions = useSelector(selectAreas);
  const user = useSelector(selectUser);
  const recipes = useSelector(selectRecipes);
  const favorites = useSelector(selectFavorites);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user && (!favorites || favorites.length === 0)) {
      dispatch(fetchFavoriteRecipes());
    }
  }, [user, favorites, dispatch])

  useEffect(() => {
    dispatch(fetchRecipes({
      page,
      category: category?.id,
      area: selectedRegion,
      ingredients: selectedIngredient ? [selectedIngredient] : null,
    }));
  }, [page, category, selectedIngredient, selectedRegion, dispatch]);

  const handleFiltersChange = ({ ingredient, region }) => {
    setSelectedIngredient(ingredient);
    setSelectedRegion(region);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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

  return (
    <section className={css.recipesSection}>
      <div className={css.titleWrapper}>
        <button type="button" onClick={onBack} className={css.backButton}>
          ← Back
        </button>
        <h2 className={css.categoryTitle}>{category.name}</h2>
        <p className={css.categoryDescription}>{category.desc}</p>
      </div>
      <div className={css.recipesWrapper}>
        <RecipeFilters
          ingredients={ingredients}
          regions={regions}
          selectedIngredient={selectedIngredient}
          selectedRegion={selectedRegion}
          onChange={handleFiltersChange}
        />
        <div className={css.recipesListWrapper}>
          {recipes && (
            <RecipeList
              recipes={recipes}
              onAuthorClick={handleAuthorClick}
              onDetailsClick={handleDetailsClick}
            />
          )}
          <RecipePagination onPageChange={handlePageChange} />
        </div>
      </div>
    </section>
  );
};

export default Recipes;
