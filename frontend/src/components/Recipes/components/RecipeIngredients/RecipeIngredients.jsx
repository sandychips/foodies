import css from "./RecipeIngredients.module.css";

const RecipeIngredients = ({ ingredients = [] }) => (
  <div>
    <h3 className={css.ingredientsTitle}>Ingredients</h3>
    <ul className={css.ingredientsList}>
      {ingredients.map((item) => {
        const ingredient = item.ingredient || item;
        const measure = item.RecipeIngredient?.measure || item.measure || "";
        const image = ingredient?.image || ingredient?.img || ingredient?.thumb;

        return (
          <li className={css.ingredientsItem} key={`${ingredient?.id}-${measure}`}>
            {image ? (
              <img src={image} alt={ingredient?.name || "Ingredient"} className={css.ingredientsImg} />
            ) : (
              <div className={css.ingredientsPlaceholder} aria-hidden="true" />
            )}
            <div className={css.ingredientsInfo}>
              <p className={css.ingredientsName}>{ingredient?.name || "Unknown"}</p>
              <p className={css.ingredientsMeasure}>{measure}</p>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export default RecipeIngredients;
