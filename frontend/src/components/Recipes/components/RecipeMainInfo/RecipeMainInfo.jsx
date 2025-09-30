import css from "./RecipeMainInfo.module.css";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  openSignInModal,
} from "../../../../redux/slices/usersSlice";
const RecipeMainInfo = ({ data }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectUser);
  const dispatch = useDispatch();

  const owner = data.owner || data.user || {};
  const categoryName = data.category?.name || "Unknown";
  const cookingTime = data.time ?? data.cookingTime ?? "—";

  const onAuthorClick = (id) => {
    if (!id) return;
    if (isAuthenticated) {
      navigate(`/user/${id}`);
    } else {
      dispatch(openSignInModal());
    }
  };

  return (
    <div className={css.recipeBox}>
      <h2 className={css.mainTitle}>{data.title}</h2>
      <div className={css.recipeMetrics}>
        <p className={css.category}>{categoryName}</p>
        <p className={css.time}>{cookingTime} min</p>
      </div>
      <p className={css.recipeDescription}>{data.description}</p>
      <button
        className={css.userBox}
        type="button"
        onClick={() => onAuthorClick(owner.id)}
      >
        {owner.avatar && (
          <img src={owner.avatar} alt={owner.name || "Author"} className={css.userAvatar} />
        )}
        <p className={css.userName}>
          Created by: <br /> <span>{owner.name || "Unknown chef"}</span>
        </p>
      </button>
    </div>
  );
};
export default RecipeMainInfo;
