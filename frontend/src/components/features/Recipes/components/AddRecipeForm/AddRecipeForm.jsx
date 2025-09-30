import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCategories } from "../../../../redux/slices/categoriesSlice";
import { selectAreas } from "../../../../redux/slices/areasSlice";
import { selectIngredients } from "../../../../redux/slices/ingredientsSlice";
import { createRecipe } from "../../../../redux/ops/recipesOps";
import css from "./AddRecipeForm.module.css";
import { toast } from "react-toastify";
import { fetchCategories } from "../../../../redux/ops/categoriesOps";
import { fetchAreas } from "../../../../redux/ops/areasOps";
import { fetchIngredients } from "../../../../redux/ops/ingredientsOps";
import sprite from "../../../../assets/img/sprite.svg";
import { selectUser } from "../../../../redux/slices/usersSlice";
import style from "../RecipeIngredients/RecipeIngredients.module.css";

const schema = yup.object({
  image: yup.mixed().required("Image is required"),
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .max(200, "Description must be less than 200 characters")
    .required("Description is required"),
  categoryId: yup.string().required("Category is required"),
  areaId: yup.string().required("Area is required"),
  cookingTime: yup
    .number()
    .min(1, "Cooking time must be at least 1 minute")
    .required("Cooking time is required"),
  instructions: yup
    .string()
    .max(200, "Instructions must be less than 200 characters")
    .required("Instructions is required"),
  ingredients: yup
    .string()
    .test("has-ingredients", "Ingredients is required", (value) => {
      try {
        const arr = JSON.parse(value || "[]");
        return Array.isArray(arr) && arr.length > 0;
      } catch {
        return false;
      }
    })
    .required("Ingredients is required"),
});

const AddRecipeForm = () => {
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [cookingTime, setCookingTime] = useState(10);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image: null,
      categoryId: "",
      areaId: "",
    },
  });

  useEffect(() => {
    register("image", { required: "Image is required" });
  }, [register]);

  useEffect(() => {
    setValue("ingredients", JSON.stringify(ingredients));
  }, [ingredients, setValue]);

  const description = watch("description", "");
  const instructions = watch("instructions", "");

  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const availableIngredients = useSelector(selectIngredients);

  if (!currentUser) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "red",
          fontWeight: "bold",
        }}
      >
        You must be logged in to create a recipe.
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", e.target.files, { shouldValidate: true });
    } else {
      setValue("image", null, { shouldValidate: true });
    }
  };

  const handleAddIngredient = () => {
    if (selectedIngredient && ingredientAmount) {
      const ingredient = (availableIngredients || []).find(
        (ing) => ing.id === selectedIngredient
      );
      if (ingredient) {
        setIngredients([
          ...ingredients,
          { ...ingredient, amount: ingredientAmount },
        ]);
        setSelectedIngredient("");
        setIngredientAmount("");
      }
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleClearForm = () => {
    reset();
    setIngredients([]);
    setImagePreview("");
  };

  const onSubmit = async (data) => {
    data.cookingTime = cookingTime;

    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("thumb", data.image[0]);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("areaId", data.areaId);
      formData.append("categoryId", data.categoryId);
      formData.append("time", data.cookingTime);
      formData.append(
        "ingredients",
        JSON.stringify(
          ingredients.map((itm) => ({
            ingredientId: itm.id,
            measure: itm.amount,
          }))
        )
      );
      formData.append("instructions", data.instructions);
      const result = await dispatch(createRecipe(formData)).unwrap();
      console.log("Recepi created:", result);

      reset();
      setIngredients([]);
      setImagePreview("");
      setCookingTime(10);
      toast.success("Recipe successfully created!");
      navigate(`/user/${currentUser.id}`);
    } catch (error) {
      console.log(error.message);
      toast.error("Error creating recipe: " + error.message);
    }
  };

  return (
    <form className={css.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <div className={css.formContent}>
        <div className={css.imageUploadWrapper}>
          <input
            id="recipe-image"
            className={css.imgInput}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <label htmlFor="recipe-image" className={css.customFileLabel}>
            {imagePreview ? (
              <img
                className={css.imageUpload}
                src={imagePreview}
                alt="Preview"
              />
            ) : (
              <span>Upload a photo</span>
            )}
          </label>
          {errors.image && (
            <span style={{ color: "red" }}>{errors.image.message}</span>
          )}
        </div>
        <div className={css.flexRightColumn}>
          <div>
            <input
              className={css.nameOfRec}
              placeholder="The name of the recipe"
              type="text"
              {...register("title")}
            />
            {errors.title && (
              <span style={{ color: "red" }}>{errors.title.message}</span>
            )}
          </div>

          <div className={css.addDescrptn}>
            <input
              placeholder="Enter a description of the dish"
              type="text"
              {...register("description")}
            />
            <label>({description.length}/200)</label>

            {errors.description && (
              <span style={{ color: "red" }}>{errors.description.message}</span>
            )}
          </div>
          <div className={css.flexRowContainer}>
            <div className={css.subContainer}>
              <label className={css.titleAddRecipePage}>Category</label>
              <div className={css.customSelectWrapper}>
                <select {...register("categoryId")}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoryId && (
                <span style={{ color: "red" }}>{errors.categoryId.message}</span>
              )}
            </div>

            <div className={css.subContainer}>
              <label className={css.titleAddRecipePage}>Area</label>
              <div className={css.customSelectWrapper}>
                <select {...register("areaId")}>
                  <option value="">Select area</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.areaId && (
                <span style={{ color: "red" }}>{errors.areaId.message}</span>
              )}
            </div>

            <div className={css.subContainer}>
              <label className={css.titleAddRecipePage}>
                Cooking Time (minutes):
              </label>
              <div className={css.cookingTimeWrapper}>
                <button
                  type="button"
                  className={css.timeBtn}
                  onClick={() =>
                    setCookingTime((prev) => Math.max(1, prev - 1))
                  }
                >
                  –
                </button>
                <input
                  className={css.cookingTime}
                  type="number"
                  min="1"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                  {...register("cookingTime")}
                  style={{ textAlign: "center", width: "80px" }}
                />
                <button
                  type="button"
                  className={css.timeBtn}
                  onClick={() => setCookingTime((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              {errors.cookingTime && (
                <span style={{ color: "red" }}>
                  {errors.cookingTime.message}
                </span>
              )}
            </div>
          </div>
          <div className={css.subContainer}>
            <label className={css.titleAddRecipePage}>Ingredients</label>
            <div className={css.flexRowContainer}>
              <div className={css.customSelectWrapper}>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                >
                  <option value="">Select ingredient</option>
                  {(availableIngredients || []).map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className={css.addDescrptn}
                type="text"
                placeholder="Enter quantity"
                value={ingredientAmount}
                onChange={(e) => setIngredientAmount(e.target.value)}
              />
            </div>
            <button
              className={css.formButton}
              type="button"
              onClick={handleAddIngredient}
            >
              Add ingredient +
            </button>
            <input
              type="hidden"
              value={JSON.stringify(ingredients)}
              {...register("ingredients")}
            />
            {errors.ingredients && (
              <span style={{ color: "red" }}>{errors.ingredients.message}</span>
            )}
          </div>

          <div className={style.ingridientsWrapper}>
            <ul className={style.ingredientsList}>
              {ingredients.map((item, idx) => (
                <li
                  className={style.ingredientsItem}
                  key={idx}
                  style={{ position: "relative" }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className={style.ingredientsImg}
                  />
                  <div className={style.ingredientsInfo}>
                    <p className={style.ingredientsName}>{item.name}</p>
                    <p className={style.ingredientsMeasure}>{item.amount}</p>
                  </div>
                  <button
                    className={css.removeIngredientBtn}
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    title="Remove ingredient"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className={css.titleAddRecipePage}>Recipe Preparation</label>
          </div>
          <div className={css.addDescrptn}>
            <input
              placeholder="Enter recipe"
              type="text"
              {...register("instructions")}
            />
            <label>({instructions.length}/200)</label>

            {errors.instructions && (
              <span style={{ color: "red" }}>
                {errors.instructions.message}
              </span>
            )}
          </div>

          <div className={css.buttonsContainer}>
            <button
              type="button"
              className={css.clearButton}
              onClick={handleClearForm}
            >
              <svg aria-hidden="true">
                <use href={`${sprite}#icon-trash`} />
              </svg>
            </button>
            <button className={css.publishButton} type="submit">
              Publish
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddRecipeForm;
