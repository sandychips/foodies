import { useSelector } from "react-redux";
import { selectRecipesPage, selectRecipesTotalPages } from '@/redux/slices/recipesSlice.js'
import css from "./RecipePagination.module.css";

const RecipePagination = ({ onPageChange }) => {
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);
  if (totalPages <= 1) return null;
  return (
    <div className={css.pagination}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onPageChange(num)}
          className={
            num === page ? `${css.pageBtn} ${css.pageBtnActive}` : css.pageBtn
          }
          disabled={num === page}
          aria-label={`Go to page ${num}`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default RecipePagination;
