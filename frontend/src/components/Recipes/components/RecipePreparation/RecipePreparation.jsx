import css from './RecipePreparation.module.css';

const RecipePreparation = ({ preparation, onFavoriteToggle, isFavorite }) => (
  <div>
    <h3 className={css.preparationTitle}>Recipe Preparation</h3>
    <p className={css.preparationDesc}>{preparation}</p>
    <button onClick={onFavoriteToggle} className={css.favoriteButton} type="button">
      {isFavorite ? "Remove from favorites" : "Add to favorites"}
    </button>
  </div>
);

export default RecipePreparation;
