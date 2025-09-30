import css from "./RecipeInfo.module.css";
import RecipeMainInfo from "../RecipeMainInfo/RecipeMainInfo";
import RecipeIngredients from "../RecipeIngredients/RecipeIngredients";
import RecipePreparation from "../RecipePreparation/RecipePreparation";
import { useFavorites } from "@/hooks/useFavorites";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  fetchFavoriteRecipes
} from "../../../../redux/ops/recipesOps";
import {
  selectCurrentRecipe,
  clearFavorites,
  // selectRecipesIsLoading,
  // selectRecipesError
} from "../../../../redux/slices/recipesSlice";
import { selectUser } from "../../../../redux/slices/usersSlice";

const RecipeInfo = ({ data }) => {
  const { isInFavorites, toggleFavorite } = useFavorites();
  const dispatch = useDispatch();
  // const isLoading = useSelector(selectRecipesIsLoading);
  const recipe = useSelector(selectCurrentRecipe);

  const isAuthenticated = useSelector(selectUser);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearFavorites());
    } else dispatch(fetchFavoriteRecipes());
  }, [isAuthenticated, dispatch]);

  return (
    <section className={css.recipeSection}>
      <div className={css.recipeWrapper}>
        <img
          src={data.thumb}
          alt={data.title}
          className={css.recipeImg}
          width={551}
          height={400}
        />

        <div className={css.recipeDetails}>
          <RecipeMainInfo data={data} />
          <RecipeIngredients ingredients={data.ingredients} />
          <RecipePreparation
            preparation={data.instructions}
            onFavoriteToggle={() => toggleFavorite(recipe)}
            isFavorite={isInFavorites(recipe)}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </section>
  );
};

export default RecipeInfo;
