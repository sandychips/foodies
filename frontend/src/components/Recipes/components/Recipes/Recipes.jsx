import RecipeFilters from "../RecipeFilters/RecipeFilters";
import RecipeList from "../RecipeList/RecipeList";
import RecipePagination from "../RecipePagination/RecipePagination";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIngredients } from "@/redux/slices/ingredientsSlice.js";
import { selectAreas } from "@/redux/slices/areasSlice.js";
import {
  fetchFavoriteRecipes,
  fetchRecipes,
} from "@/redux/ops/recipesOps";
import {
  selectFavorites,
  selectRecipes,
  setPage as setPageAction,
  setSelectedCategoryId,
  setSelectedAreaId,
  setSelectedIngredientId,
} from "@/redux/slices/recipesSlice";
import css from "./Recipes.module.css";
import { openSignInModal, selectUser } from "@/redux/slices/usersSlice.js";

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
    const categoryId = category?.id ?? null;
    dispatch(setSelectedCategoryId(categoryId));
    dispatch(setSelectedAreaId(selectedRegion));
    dispatch(setSelectedIngredientId(selectedIngredient));
    dispatch(
      fetchRecipes({
        page,
        categoryId,
        areaId: selectedRegion,
        ingredientId: selectedIngredient,
      })
    );
    dispatch(setPageAction(page));
  }, [dispatch, category?.id, selectedRegion, selectedIngredient, page]);

  useEffect(() => {
    if (user && (!favorites || favorites.length === 0)) {
      dispatch(fetchFavoriteRecipes());
    }
  }, [user, favorites, dispatch]);

  const handleFiltersChange = ({ ingredient, region }) => {
    setSelectedIngredient(ingredient || null);
    setSelectedRegion(region || null);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAuthorClick = (author) => {
    if (author?.id) {
      if (user) {
        navigate(`/user/${author.id}`);
      } else {
        dispatch(openSignInModal());
      }
    }
  };

  const handleDetailsClick = (recipe) => {
    if (recipe?.id) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <section className={css.recipesSection}>
      <div className={css.titleWrapper}>
        <button type="button" onClick={onBack} className={css.backButton}>
          ← Back
        </button>
        <h2 className={css.categoryTitle}>{category.name}</h2>
        <p className={css.categoryDescription}>{category.description}</p>
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
