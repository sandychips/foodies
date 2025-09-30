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

  const onAvatarClick = (id) => {
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
        <p className={css.category}>{data.category.name}</p>
        <p className={css.time}>{data.time} min</p>
      </div>
      <p className={css.recipeDescription}>{data.description}</p>
      <button
        className={css.userBox}
        type="button"
        onClick={() => onAvatarClick(data.user.id)}
      >
        <img src={data.user?.avatar} alt="user" className={css.userAvatar} />
        <p className={css.userName}>
          Created by: <br /> <span>{data.user?.name}</span>
        </p>
      </button>
    </div>
  );
};
export default RecipeMainInfo;
