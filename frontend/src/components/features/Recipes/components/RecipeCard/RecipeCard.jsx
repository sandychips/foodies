import css from "./RecipeCard.module.css";
import sprite from '@/assets/img/sprite.svg';

const RecipeCard = ({
  recipe,
  author,
  isFavorite,
  onAuthorClick,
  onFavoriteToggle,
  onDetailsClick,
}) => (
  <div className={css.card}>
    <img
      src={recipe.thumb}
      alt={recipe.title}
      loading="lazy"
      className={css.image}
    />
    <h4 className={css.title}>{recipe.title}</h4>
    <p className={css.description}>{recipe.description}</p>
    <div className={css.footer}>
      <button type="button" onClick={onAuthorClick} className={css.authorBtn}>
        <img
          src={author.avatar}
          alt={author.name}
          className={css.authorAvatar}
          loading="lazy"
        />
        <span>{author.name}</span>
      </button>
      <div className={css.actions}>
        <button
          type="button"
          onClick={onFavoriteToggle}
          title="Add/remove from favorites"
          className={isFavorite ? `${css.active}` : ''}
        >
          <svg>
            <use className={css.icon} href={`${sprite}#icon-heart-empty`} />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDetailsClick}
          title="Recipe details"
          className={css.detailsBtn}
        >
          <svg>
            <use className={css.icon} href={`${sprite}#icon-arrow`} />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default RecipeCard;
