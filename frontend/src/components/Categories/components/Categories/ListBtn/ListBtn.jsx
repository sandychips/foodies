// import Icon from 'src/components/shared/Icon/Icon.jsx';
// Додати іконки і потім цю логіку

import clsx from "clsx";
import styles from "./ListBtn.module.css";

export const ListBtn = ({ category, imgUrl, imgUrl2x, onClick, isAll = false }) => {
  const isRetina = typeof window !== "undefined" && window.devicePixelRatio > 1;
  const backgroundImage = !isAll && (isRetina && imgUrl2x ? imgUrl2x : imgUrl);

  return (
    <button
      className={clsx(styles["recipe-list-btn"], isAll && styles.allCategories)}
      type="button"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      onClick={onClick}
    >
      <div className={styles['labels-wrapper']}>
        <p className={styles['category']}>{category}</p>
        {/* <div className={styles['icon-wrapper']}>
          <Icon
            customStyle={styles['icon']}
            iconId={'icon-arrow-up-right'}
            width={20}
            height={20}
          />
        </div> */}
      </div>
    </button>
  );
};
