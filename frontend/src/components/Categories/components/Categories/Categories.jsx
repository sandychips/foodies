import { useEffect } from "react";
import { toast } from "react-toastify";

import CategoryList from "../CategoryList/CategoryList";
import MainTitle from "../../../MainTitle/MainTitle";
import Subtitle from "../../../Subtitle/Subtitle";
import styles from "./Categories.module.css";

const Categories = ({ error = "", onCategorySelect }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <section className={`${styles["categories-section"]} container`}>
      <div className={styles["categories-wrapper"]}>
        <MainTitle className={styles["categories-title"]}>Categories</MainTitle>
        <Subtitle className={styles["categories-description"]}>
          Discover a limitless world of culinary possibilities and enjoy
          exquisite recipes that combine taste, style and the warm atmosphere of
          the kitchen.
        </Subtitle>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
      <CategoryList onCategorySelect={onCategorySelect} />
    </section>
  );
};

export default Categories;
