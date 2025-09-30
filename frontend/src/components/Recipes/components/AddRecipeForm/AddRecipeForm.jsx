import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

import css from "./AddRecipeForm.module.css";
import sprite from "../../../../assets/img/sprite.svg";
import style from "../RecipeIngredients/RecipeIngredients.module.css";

import { selectCategories } from "../../../../redux/slices/categoriesSlice";
import { selectAreas } from "../../../../redux/slices/areasSlice";
import { selectIngredients } from "../../../../redux/slices/ingredientsSlice";
import { selectUser } from "../../../../redux/slices/usersSlice";

import { fetchCategories } from "../../../../redux/ops/categoriesOps";
import { fetchAreas } from "../../../../redux/ops/areasOps";
import { fetchIngredients } from "../../../../redux/ops/ingredientsOps";
import { createRecipe } from "../../../../redux/ops/recipesOps";

const validationSchema = yup.object({
  image: yup.mixed().required("Image is required"),
  title: yup.string().trim().required("Title is required"),
  description: yup
    .string()
    .trim()
    .max(200, "Description must be less than 200 characters")
    .required("Description is required"),
  categoryId: yup.string().required("Category is required"),
  areaId: yup.string().required("Area is required"),
  cookingTime: yup
    .number()
    .typeError("Cooking time must be at least 1 minute")
    .min(1, "Cooking time must be at least 1 minute")
    .required("Cooking time is required"),
  instructions: yup
    .string()
    .trim()
    .max(1000, "Instructions must be less than 1000 characters")
    .required("Instructions are required"),
  ingredients: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required(),
        image: yup.string().nullable(),
        amount: yup.string().trim().required(),
      })
    )
    .min(1, "Please add at least one ingredient"),
});

const initialValues = {
  image: null,
  title: "",
  description: "",
  categoryId: "",
  areaId: "",
  cookingTime: 10,
  instructions: "",
  ingredients: [],
};

const AddRecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const availableIngredients = useSelector(selectIngredients);

  const [imagePreview, setImagePreview] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const ingredientsMap = useMemo(() => {
    return (availableIngredients || []).reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [availableIngredients]);

  if (!currentUser) {
    return null;
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!values.ingredients.length) {
      toast.error("Please add at least one ingredient");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("thumb", values.image);
      formData.append("title", values.title.trim());
      formData.append("description", values.description.trim());
      formData.append("categoryId", values.categoryId);
      formData.append("areaId", values.areaId);
      formData.append("time", Number(values.cookingTime));
      formData.append(
        "ingredients",
        JSON.stringify(
          values.ingredients.map((ingredient) => ({
            ingredientId: ingredient.id,
            measure: ingredient.amount,
          }))
        )
      );
      formData.append("instructions", values.instructions.trim());

      const recipe = await dispatch(createRecipe(formData)).unwrap();

      toast.success("Recipe successfully created!");
      resetForm({ values: { ...initialValues, cookingTime: 10 } });
      setImagePreview("");
      setSelectedIngredient("");
      setIngredientAmount("");

      if (recipe?.id) {
        navigate(`/recipe/${recipe.id}`);
      } else {
        navigate(`/user/${currentUser.id}`);
      }
    } catch (error) {
      toast.error(`Error creating recipe: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => {
        const descriptionLength = values.description.length;
        const instructionsLength = values.instructions.length;

        const handleImageChange = (event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            setFieldValue("image", file);
            setImagePreview(URL.createObjectURL(file));
          } else {
            setFieldValue("image", null);
            setImagePreview("");
          }
        };

        const handleAddIngredient = () => {
          if (!selectedIngredient || !ingredientAmount.trim()) {
            toast.info("Select an ingredient and provide a quantity");
            return;
          }

          const ingredient = ingredientsMap[selectedIngredient];
          if (!ingredient) {
            toast.error("Unable to find the selected ingredient");
            return;
          }

          const nextIngredients = [
            ...values.ingredients,
            {
              id: ingredient.id,
              name: ingredient.name,
              image: ingredient.image,
              amount: ingredientAmount.trim(),
            },
          ];

          setFieldValue("ingredients", nextIngredients);
          setSelectedIngredient("");
          setIngredientAmount("");
        };

        const handleRemoveIngredient = (index) => {
          const nextIngredients = values.ingredients.filter((_, idx) => idx !== index);
          setFieldValue("ingredients", nextIngredients);
        };

        const handleClearForm = () => {
          setImagePreview("");
          setSelectedIngredient("");
          setIngredientAmount("");
          setFieldValue("image", null);
          setFieldValue("title", "");
          setFieldValue("description", "");
          setFieldValue("categoryId", "");
          setFieldValue("areaId", "");
          setFieldValue("cookingTime", 10);
          setFieldValue("instructions", "");
          setFieldValue("ingredients", []);
        };

        return (
          <Form className={css.formContainer} encType="multipart/form-data">
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
                    <img className={css.imageUpload} src={imagePreview} alt="Recipe preview" />
                  ) : (
                    <span>Upload a photo</span>
                  )}
                </label>
                {touched.image && errors.image && (
                  <span className={css.errorMessage}>{errors.image}</span>
                )}
              </div>

              <div className={css.flexRightColumn}>
                <div>
                  <Field
                    name="title"
                    className={css.nameOfRec}
                    placeholder="The name of the recipe"
                    type="text"
                  />
                  <ErrorMessage name="title" component="span" className={css.errorMessage} />
                </div>

                <div className={css.addDescrptn}>
                  <Field
                    name="description"
                    placeholder="Enter a description of the dish"
                    type="text"
                  />
                  <label>({descriptionLength}/200)</label>
                  <ErrorMessage name="description" component="span" className={css.errorMessage} />
                </div>

                <div className={css.flexRowContainer}>
                  <div className={css.subContainer}>
                    <label className={css.titleAddRecipePage}>Category</label>
                    <div className={css.customSelectWrapper}>
                      <Field as="select" name="categoryId">
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="categoryId" component="span" className={css.errorMessage} />
                  </div>

                  <div className={css.subContainer}>
                    <label className={css.titleAddRecipePage}>Area</label>
                    <div className={css.customSelectWrapper}>
                      <Field as="select" name="areaId">
                        <option value="">Select area</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="areaId" component="span" className={css.errorMessage} />
                  </div>

                  <div className={css.subContainer}>
                    <label className={css.titleAddRecipePage}>Cooking Time (minutes):</label>
                    <div className={css.cookingTimeWrapper}>
                      <button
                        type="button"
                        className={css.timeBtn}
                        onClick={() =>
                          setFieldValue("cookingTime", Math.max(1, Number(values.cookingTime) - 1))
                        }
                        aria-label="Decrease cooking time"
                      >
                        –
                      </button>
                      <input
                        className={css.cookingTime}
                        type="number"
                        min="1"
                        value={values.cookingTime}
                        onChange={(e) =>
                          setFieldValue("cookingTime", Math.max(1, Number(e.target.value)))
                        }
                        style={{ textAlign: "center", width: "80px" }}
                      />
                      <button
                        type="button"
                        className={css.timeBtn}
                        onClick={() => setFieldValue("cookingTime", Number(values.cookingTime) + 1)}
                        aria-label="Increase cooking time"
                      >
                        +
                      </button>
                    </div>
                    <ErrorMessage name="cookingTime" component="span" className={css.errorMessage} />
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
                  {touched.ingredients && errors.ingredients && (
                    <span className={css.errorMessage}>{errors.ingredients}</span>
                  )}
                </div>

                <div className={style.ingridientsWrapper}>
                  <ul className={style.ingredientsList}>
                    {values.ingredients.map((item, idx) => (
                      <li className={style.ingredientsItem} key={`${item.id}-${idx}`}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className={style.ingredientsImg}
                          />
                        ) : (
                          <div className={style.ingredientsImg} style={{ background: "rgba(191,190,190,0.2)" }} />
                        )}
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
                  <Field
                    as="textarea"
                    name="instructions"
                    placeholder="Enter recipe"
                    rows={6}
                    maxLength={1000}
                    className={css.textarea}
                  />
                  <label>({instructionsLength}/1000)</label>
                  <ErrorMessage name="instructions" component="span" className={css.errorMessage} />
                </div>

                <div className={css.buttonsContainer}>
                  <button
                    type="button"
                    className={css.clearButton}
                    onClick={handleClearForm}
                    aria-label="Clear form"
                  >
                    <svg aria-hidden="true">
                      <use href={`${sprite}#icon-trash`} />
                    </svg>
                  </button>
                  <button className={css.publishButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddRecipeForm;
