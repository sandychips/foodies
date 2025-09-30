import { useFavorites } from '@/hooks/useFavorites';
import RecipeCard from "../RecipeCard/RecipeCard";
import css from "./RecipeList.module.css";

const RecipeList = ({
  recipes,
  onAuthorClick,
  onDetailsClick,
}) => {
  const { isInFavorites, toggleFavorite } = useFavorites();
  if (!recipes?.length)
    return <div className={css.empty}>No recipes found</div>;
  return (
    <div className={css.list}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          author={recipe.owner}
          isFavorite={isInFavorites(recipe)}
          onAuthorClick={() => onAuthorClick(recipe.author)}
          onFavoriteToggle={() => toggleFavorite(recipe)}
          onDetailsClick={() => onDetailsClick(recipe)}
        />
      ))}
    </div>
  );
};

export default RecipeList;
