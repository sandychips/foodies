import css from "./RecipeFilters.module.css";

const RecipeFilters = ({
  ingredients,
  regions,
  selectedIngredient,
  selectedRegion,
  onChange,
}) => {
  return (
    <div className={css.filters}>
      <div className={css.customSelectWrapper}>
        <select
          className={css.select}
          value={selectedIngredient || ""}
          onChange={(e) =>
            onChange({ ingredient: e.target.value, region: selectedRegion })
          }
        >
          <option value="">Ingredients</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name}
            </option>
          ))}
        </select>
      </div>
      <div className={css.customSelectWrapper}>
        <select
          className={css.select}
          value={selectedRegion || ""}
          onChange={(e) =>
            onChange({ ingredient: selectedIngredient, region: e.target.value })
          }
        >
          <option value="">Area</option>
          {regions.map((reg) => (
            <option key={reg.id} value={reg.id}>
              {reg.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RecipeFilters;
