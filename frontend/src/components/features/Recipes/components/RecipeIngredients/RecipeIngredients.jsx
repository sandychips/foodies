import css from "./RecipeIngredients.module.css";

const RecipeIngredients = ({ ingredients }) => (
  <div>
    <h3 className={css.ingredientsTitle}>Ingredients</h3>
    <ul className={css.ingredientsList}>
      {ingredients.map((item, idx) => (
        <li className={css.ingredientsItem} key={idx}>
            <img
              src={item.ingredient.img}
              alt={item.ingredient.name}
              className={css.ingredientsImg}
            />
            <div className={css.ingredientsInfo}>
              <p className={css.ingredientsName}>{item.ingredient.name}</p>
              <p className={css.ingredientsMeasure}>
                {item.measure}
              </p>
            </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecipeIngredients;
