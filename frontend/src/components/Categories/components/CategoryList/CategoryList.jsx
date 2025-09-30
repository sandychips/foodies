import css from "./CategoryList.module.css";
import { useMemo, useState } from "react";
import { ShowMoreBtn } from "../Categories/ShowMoreBtn/ShowMoreBtn";
import { ListBtn } from "../Categories/ListBtn/ListBtn";
import { useSelector } from "react-redux";
import { selectCategories } from "../../../../redux/slices/categoriesSlice";
import { allCategoriesImages } from "../../../../utils/loadCategoryImages";

const NUMBER_CAT_ELEMENTS = 11;

const CategoryList = ({ onCategorySelect }) => {
  const categories = useSelector(selectCategories);

  const normalizedCategories = useMemo(() => {
    const mapped = categories
      .filter((cat) => allCategoriesImages[cat.lowerName])
      .map((cat) => ({
        id: cat.id,
        category: cat.name,
        description: cat.description,
        imgUrl: allCategoriesImages[cat.lowerName].normal,
        imgUrl2x: allCategoriesImages[cat.lowerName].retina,
        original: cat,
      }));

    return [
      {
        id: "all",
        category: "All categories",
        description: "Explore every recipe in one place",
        imgUrl: null,
        imgUrl2x: null,
        isAll: true,
      },
      ...mapped,
    ];
  }, [categories]);

  const [numberCatElements, setNumberCatElements] =
    useState(NUMBER_CAT_ELEMENTS);

  const renderCategoryList = normalizedCategories.slice(0, numberCatElements);

  const isExpanded = numberCatElements >= normalizedCategories.length;

  const handlerShowMoreBtn = () => {
    if (isExpanded) {
      setNumberCatElements(NUMBER_CAT_ELEMENTS);
    } else {
      setNumberCatElements(normalizedCategories.length);
    }
  };

  const buttonLabel = isExpanded
    ? "Show Less Categories"
    : "Show All Categories";

  if (!categories?.length) return <div>Categories not found</div>;

  return (
    <nav>
      <ul className={css.list}>
        {renderCategoryList.map((cat) => (
          <li key={cat.id} className={css.item}>
            <ListBtn
              category={cat.category}
              imgUrl={cat.imgUrl}
              imgUrl2x={cat.imgUrl2x}
              isAll={cat.isAll}
              onClick={() =>
                onCategorySelect(
                  cat.isAll
                    ? {
                        id: null,
                        name: "All categories",
                        description: cat.description,
                      }
                    : cat.original
                )
              }
            >
              ➡️
            </ListBtn>
          </li>
        ))}
        <li>
          <ShowMoreBtn onClick={handlerShowMoreBtn}>{buttonLabel}</ShowMoreBtn>
        </li>
      </ul>
    </nav>
  );
};

export default CategoryList;
