import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./UserCard.module.css";
import sprite from "../../../assets/img/sprite.svg";

const UserCard = ({
  userId,
  avatarUrl,
  name,
  recipesCount,
  recipesList = [],
  isFollowing,
  tabType, // 'followers' або 'following'
  onFollow,
  onUnfollow,
  onRemoveFromFollowingList,
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [removed, setRemoved] = useState(false);

  if (tabType === "following" && removed) return null;

  const handleFollow = async () => {
    await onFollow(userId);
    setFollowing(true);
  };

  const handleUnfollow = async () => {
    await onUnfollow(userId);
    setFollowing(false);
    if (tabType === "following") {
      setRemoved(true);
      if (onRemoveFromFollowingList) onRemoveFromFollowingList(userId);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.userInfo}>
        <img src={avatarUrl} alt={name} className={styles.avatar} />
        <div className={styles.userDetails}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.recipesCount}>Own recipes: {recipesCount}</p>
          {/* Кнопка Follow/Following */}
          {tabType === "followers" &&
            (following ? (
              <button
                type="button"
                onClick={handleUnfollow}
                className={styles.followingBtn}
              >
                Following
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFollow}
                className={styles.followBtn}
              >
                Follow
              </button>
            ))}
          {tabType === "following" && (
            <button
              type="button"
              onClick={handleUnfollow}
              className={styles.followingBtn}
            >
              Following
            </button>
          )}
        </div>
      </div>

      {/* Список рецептів для планшетів і десктопів */}
      <div className={styles.recipesSection}>
        {recipesList.length > 0 ? (
          <ul className={styles.recipesList}>
            {(window.innerWidth >= 768 && window.innerWidth < 1440
              ? recipesList.slice(0, 3)
              : recipesList
            ).map((recipe) => (
              <li key={recipe.id}>
                <img
                  src={recipe.thumb}
                  alt={recipe.title}
                  title={recipe.title}
                  className={styles.recipeThumb}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noRecipes}>No recipes</div>
        )}
      </div>

      <Link to={`/user/${userId}`} className={styles.viewAllBtn}>
        <svg className={styles.viewAllBtnIcon}>
          <use href={`${sprite}#icon-arrow`} />
        </svg>
      </Link>
    </div>
  );
};

UserCard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  avatarUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  recipesCount: PropTypes.number.isRequired,
  recipesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      thumb: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  isFollowing: PropTypes.bool,
  tabType: PropTypes.oneOf(["followers", "following"]).isRequired,
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  onRemoveFromFollowingList: PropTypes.func,
};

export default UserCard;
