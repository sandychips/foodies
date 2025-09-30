import styles from './ShowMoreBtn.module.css';

export const ShowMoreBtn = ({ onClick, children }) => {
  return (
    <button className={styles['show-more-btn']} type="button" onClick={onClick}>
      {children}
    </button>
  );
};
