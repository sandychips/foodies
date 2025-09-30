import PathInfo from "../../components/Common/PathInfo/PathInfo";
import RecipeInfo from "../../components/Recipes/components/RecipeInfo/RecipeInfo";
import PopularRecipes from "../../components/Recipes/components/PopularRecipes/PopularRecipes";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchRecipeById } from "../../redux/ops/recipesOps";
import {
  selectCurrentRecipe,
  selectRecipesIsLoading,
  // selectRecipesError
} from "../../redux/slices/recipesSlice";

export default function RecipePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectRecipesIsLoading);
  const recipe = useSelector(selectCurrentRecipe);

  useEffect(() => {
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  return (
    !isLoading &&
    recipe && (
      <div className="container">
        <PathInfo currentPageName={recipe.title} />
        <RecipeInfo data={recipe} />
        <PopularRecipes />
      </div>
    )
  );
}
