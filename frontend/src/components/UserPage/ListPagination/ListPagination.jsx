import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";

import {
  selectRecipesPage as selectPage,
  selectRecipesTotalPages as selectTotalPages,
  setPage,
  setSelectedAreaId,
  setSelectedCategoryId,
  setSelectedIngredientId,
} from "@/redux/slices/recipesSlice";

import { fetchRecipes } from "@/redux/ops/recipesOps";
import css from "./ListPagination.module.css";

const ListPagination = ({
  variant = "all", // 'all', 'owner', 'user', 'favorites'
  page: propPage,
  totalPages: propTotalPages,
  selectedArea: propArea,
  selectedCategory: propCategory,
  selectedIngredients: propIngredients,
  userId,
  onPageChange,
}) => {
  const dispatch = useDispatch();

  const reduxPage = useSelector(selectPage);
  const reduxTotalPages = useSelector(selectTotalPages);

  const page = propPage ?? reduxPage;
  const totalPages = propTotalPages ?? reduxTotalPages;

  const loadPage = (targetPage) => {
    dispatch(setPage(targetPage));

    const commonPayload = { page: targetPage };

    switch (variant) {
      case "user":
      case "owner":
      case "favorites":
        dispatch(fetchRecipes(commonPayload));
        break;
      case "all":
      default: {
        const categoryId = propCategory?.id ?? null;
        const areaId = propArea ?? null;
        const ingredientIds = propIngredients ?? [];
        dispatch(setSelectedCategoryId(categoryId));
        dispatch(setSelectedAreaId(areaId));
        dispatch(setSelectedIngredientId(ingredientIds[0] ?? null));
        dispatch(
          fetchRecipes({
            ...commonPayload,
            categoryId,
            areaId,
            ingredientId: ingredientIds[0] ?? null,
          })
        );
        break;
      }
    }
  };

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, userId, propCategory, propArea, propIngredients]);

  const handlePageClick = ({ selected }) => {
    const newPage = selected + 1;
    if (typeof onPageChange === "function") {
      onPageChange(newPage);
    }
    loadPage(newPage);
  };

  return (
    <div>
      {totalPages > 1 && (
        <ReactPaginate
          previousLabel={null}
          nextLabel={null}
          pageCount={totalPages}
          onPageChange={handlePageClick}
          breakLabel="..."
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          containerClassName={css.paginationContainer}
          pageClassName={css.paginationItem}
          pageLinkClassName={css.pageLink}
          activeClassName={css.paginationItemActive}
          breakClassName={css.break}
          breakLinkClassName={css.breakLink}
          forcePage={page - 1}
        />
      )}
    </div>
  );
};

export default ListPagination;
