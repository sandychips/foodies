/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import RecipePreview from "../../Recipes/components/RecipePreview/RecipePreview.jsx";
import UserCard from "../UserCard/UserCard.jsx";
import css from "./ListItems.module.css";
import {
  removeRecipe,
  fetchMyRecipes,
  removeRecipeFromFavorites,
  fetchFavoriteRecipes,
} from "../../../redux/ops/recipesOps.js";
import {
  followUser,
  unfollowUser,
  fetchUserFollowers,
  fetchUserFollowees,
  fetchUserById,
} from "../../../redux/ops/usersOps";
import { toast } from "react-toastify";
import defaultAvatar from "../../../assets/img/user/default-avatar.png";

export const USER_LIST_ITEMS_VARIANTS = {
  recipes: "recipes",
  favorites: "favorites",
  followers: "followers",
  following: "following",
};

const USER_LIST_RECIPE_VARIANTS = new Set([
  USER_LIST_ITEMS_VARIANTS.recipes,
  USER_LIST_ITEMS_VARIANTS.favorites,
]);

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : String(error);

const ListItems = ({ variant, items = [], profileId }) => {
  const dispatch = useDispatch();
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const isRecipeList = USER_LIST_RECIPE_VARIANTS.has(variant);
  const isUserList = !isRecipeList;

  const tabType = variant.toLowerCase();

  const refreshProfile = () => {
    if (profileId) {
      dispatch(fetchUserById(profileId));
    }
  };

  const refreshRelations = async () => {
    await Promise.all([dispatch(fetchUserFollowers()), dispatch(fetchUserFollowees())]);
    refreshProfile();
  };

  const handleRecipeAction = async (recipeId) => {
    setLocalItems((prevItems) => prevItems.filter((item) => item.id !== recipeId));

    try {
      if (variant === USER_LIST_ITEMS_VARIANTS.recipes) {
        await dispatch(removeRecipe(recipeId)).unwrap();
        await dispatch(fetchMyRecipes());
        toast.success("Recipe successfully removed!");
      } else {
        await dispatch(removeRecipeFromFavorites(recipeId)).unwrap();
        await dispatch(fetchFavoriteRecipes());
        toast.success("Recipe removed from favorites!");
      }
      refreshProfile();
    } catch (error) {
      toast.error(`Failed to update recipes: ${getErrorMessage(error)}`);
      setLocalItems(items);
    }
  };

  const handleFollow = async (userId) => {
    try {
      setLocalItems((prevItems) =>
        prevItems.map((item) =>
          item.id === userId ? { ...item, isFollowing: true } : item
        )
      );

      await dispatch(followUser(userId)).unwrap();
      toast.success("Successfully followed user!");
      await refreshRelations();
    } catch (error) {
      setLocalItems(items);
      toast.error(`Failed to follow user: ${getErrorMessage(error)}`);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setLocalItems((prevItems) =>
        prevItems.map((item) =>
          item.id === userId ? { ...item, isFollowing: false } : item
        )
      );

      await dispatch(unfollowUser(userId)).unwrap();
      toast.success("Successfully unfollowed user!");
      await refreshRelations();
    } catch (error) {
      setLocalItems(items);
      toast.error(`Failed to unfollow user: ${getErrorMessage(error)}`);
    }
  };

  const handleRemoveFromFollowingList = (userId) => {
    setLocalItems((prevItems) =>
      prevItems.filter((item) => item.id !== userId)
    );
  };

  if (!localItems.length) {
    return <div className={css.empty}>No items found</div>;
  }

  return (
    <div>
      <ul className={css.list}>
        {localItems.map((item) => (
          <li key={item.id} className={css.item}>
            {isRecipeList ? (
              <RecipePreview recipe={item} onDelete={handleRecipeAction} />
            ) : isUserList ? (
              <UserCard
                userId={item.id}
                avatarUrl={item.avatar || defaultAvatar}
                name={item.name || "User"}
                recipesCount={item.recipesCount || 0}
                recipesList={item.recipes || []}
                isFollowing={item.isFollowing || false}
                tabType={tabType}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                onRemoveFromFollowingList={handleRemoveFromFollowingList}
              />
            ) : (
              <div>Unsupported variant: {variant}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

ListItems.propTypes = {
  variant: PropTypes.oneOf(Object.keys(USER_LIST_ITEMS_VARIANTS)).isRequired,
  items: PropTypes.array.isRequired,
  profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ListItems;
