import css from "./HomePage.module.css";
import { useDispatch } from "react-redux";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/components/Categories/Categories";
import Recipes from "../../components/Recipes/components/Recipes/Recipes";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../redux/ops/categoriesOps";
import { fetchAreas } from "../../redux/ops/areasOps";
import { fetchIngredients } from "../../redux/ops/ingredientsOps";
import { fetchTestimonials } from "../../redux/ops/testimonialsOps";
import Testimonials from "../../components/Testimonials/Testimonials";


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
    dispatch(fetchTestimonials());
  }, [dispatch]);

  return (
    <div className={css.wrapper}>
      <Hero />
      {!selectedCategory && (
        <Categories onCategorySelect={setSelectedCategory} />
      )}
      {selectedCategory && (
        <Recipes
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
      <Testimonials />
    </div>
  );
}
