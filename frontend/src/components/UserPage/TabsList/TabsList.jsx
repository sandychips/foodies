import styles from "./TabsList.module.css";
import ListItems, { USER_LIST_ITEMS_VARIANTS } from "../ListItems/ListItems";
import ListPagination from "../ListPagination/ListPagination";
import PropTypes from "prop-types";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRecipes } from "../../../redux/ops/userRecipesOps";
import { fetchFavoriteRecipes } from "../../../redux/ops/recipesOps";
import {
  fetchUserFollowers,
  fetchUserFollowees,
} from "../../../redux/ops/usersOps";
import Loader from "../../Loader/Loader";
import {
  selectFavorites,
  selectFavoritesTotalPages,
  selectFavoritesIsLoading,
  selectFavoritesError,
  selectFavoritesPage,
} from "../../../redux/slices/recipesSlice";
import {
  selectUserRecipes,
  selectUserRecipesTotalPages,
  selectUserRecipesIsLoading,
  selectUserRecipesError,
  selectUserRecipesPage,
} from "../../../redux/slices/userResipesSlice";
import {
  selectUserFollowers,
  selectUserFollowersTotalPages,
  selectUserFollowersIsLoading,
  selectUserFollowersError,
  selectUserFollowees,
  selectUserFolloweesTotalPages,
  selectUserFolloweesIsLoading,
  selectUserFolloweesError,
  selectUserFollowersPage,
  selectUserFolloweesPage,
} from "../../../redux/slices/usersSlice";
import cn from "classnames";

function selectSelectors(variant, userId, page = 1) {
  switch (variant) {
    case USER_LIST_ITEMS_VARIANTS.favorites:
      return {
        load: () => fetchFavoriteRecipes(),
        items: selectFavorites,
        totalPages: selectFavoritesTotalPages,
        page: selectFavoritesPage,
        isLoading: selectFavoritesIsLoading,
        error: selectFavoritesError,
      };
    case USER_LIST_ITEMS_VARIANTS.followers:
      return {
        load: () => fetchUserFollowers(),
        items: selectUserFollowers,
        totalPages: selectUserFollowersTotalPages,
        page: selectUserFollowersPage,
        isLoading: selectUserFollowersIsLoading,
        error: selectUserFollowersError,
      };
    case USER_LIST_ITEMS_VARIANTS.following:
      return {
        load: () => fetchUserFollowees(),
        items: selectUserFollowees,
        totalPages: selectUserFolloweesTotalPages,
        page: selectUserFolloweesPage,
        isLoading: selectUserFolloweesIsLoading,
        error: selectUserFolloweesError,
      };
    default:
      return {
        load: () => fetchUserRecipes({ userId, page }),
        items: selectUserRecipes(userId),
        totalPages: selectUserRecipesTotalPages(userId),
        page: selectUserRecipesPage(userId),
        isLoading: selectUserRecipesIsLoading(userId),
        error: selectUserRecipesError(userId),
      };
  }
}

const EMPTY_MESSAGES = {
  [USER_LIST_ITEMS_VARIANTS.recipes]:
    "Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future.",
  [USER_LIST_ITEMS_VARIANTS.favorites]:
    "Nothing has been added to your favorite recipes list yet. Please browse our recipes and add your favorites for easy access in the future.",
  [USER_LIST_ITEMS_VARIANTS.followers]:
    "There are currently no followers on your account. Please engage our visitors with interesting content and draw their attention to your profile.",
  [USER_LIST_ITEMS_VARIANTS.following]:
    "Your account currently has no subscriptions to other users. Learn more about our users and select those whose content interests you.",
};

const TabsList = ({ userId, isCurrent }) => {
  const tabs = useMemo(() => {
    const baseTabs = [
      { id: USER_LIST_ITEMS_VARIANTS.recipes, label: "My recipes" },
      { id: USER_LIST_ITEMS_VARIANTS.followers, label: "Followers" },
    ];

    if (isCurrent) {
      return [
        ...baseTabs,
        { id: USER_LIST_ITEMS_VARIANTS.following, label: "Following" },
        { id: USER_LIST_ITEMS_VARIANTS.favorites, label: "Favorites" },
      ];
    }
    return baseTabs;
  }, [isCurrent]);

  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabsRef = useRef([]);
  const dispatch = useDispatch();
  const defaultTab = isCurrent
    ? USER_LIST_ITEMS_VARIANTS.favorites
    : USER_LIST_ITEMS_VARIANTS.recipes;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const selectors = useMemo(
    () => selectSelectors(activeTab, userId),
    [activeTab, userId]
  );

  const loadData = useCallback(() => {
    const shouldLoad =
      activeTab === USER_LIST_ITEMS_VARIANTS.recipes ||
      activeTab === USER_LIST_ITEMS_VARIANTS.followers ||
      (isCurrent &&
        (activeTab === USER_LIST_ITEMS_VARIANTS.following ||
          activeTab === USER_LIST_ITEMS_VARIANTS.favorites));

    if (selectors.load && shouldLoad) {
      dispatch(selectors.load());
    }
  }, [dispatch, activeTab, isCurrent, selectors]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (
      !isCurrent &&
      (activeTab === USER_LIST_ITEMS_VARIANTS.following ||
        activeTab === USER_LIST_ITEMS_VARIANTS.favorites)
    ) {
      setActiveTab(USER_LIST_ITEMS_VARIANTS.recipes);
    }
  }, [isCurrent, activeTab]);

  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    const el = tabsRef.current[idx];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab, tabs]);

  const items = useSelector(selectors.items);
  const isLoading = useSelector(selectors.isLoading);
  const error = useSelector(selectors.error);
  const totalPages = useSelector(selectors.totalPages);
  const page = useSelector(selectors.page);
  const emptyMessage = EMPTY_MESSAGES[activeTab];

  return (
    <div>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => (tabsRef.current[i] = el)}
            type="button"
            className={cn(styles.tab, {
              [styles.active]: tab.id === activeTab,
            })}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div
          className={styles.indicator}
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {isLoading && <Loader />}

      {!isLoading && !error && (
        <>
          {items.length > 0 ? (
            <>
              <ListItems variant={activeTab} items={items} profileId={userId} />
              <ListPagination
                variant="all"
                totalPages={totalPages}
                page={page}
              />
            </>
          ) : (
            <p className={styles.emptyMessage}>{emptyMessage}</p>
          )}
        </>
      )}
    </div>
  );
};

TabsList.propTypes = {
  userId: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
};

export default TabsList;
