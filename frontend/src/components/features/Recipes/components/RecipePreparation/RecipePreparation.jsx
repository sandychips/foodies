import css from './RecipePreparation.module.css';

const RecipePreparation = ({ preparation,onFavoriteToggle,isFavorite,isAuthenticated }) => (
  <div>
    <h3 className={css.preparationTitle}>Recipe Preparation</h3>
    <p className={css.preparationDesc}>{preparation}</p>
     <div title={!isAuthenticated ? "Sign in to add to favorites" : " "}>
    <button
      onClick={onFavoriteToggle }
      className={css.favoriteButton}
      type="button"
    disabled={!isAuthenticated}
    >
     {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
     </button>
</div>
  </div>
);

export default RecipePreparation;
