import styles from "./PathInfo.module.css";

const PathInfo = ({ currentPageName }) => (
  <nav className={styles.pathInfo}>
    <a href="/" className={styles.pathInfoLink}>
      Home
    </a>
    <span className={styles.pathInfoSeparator}>/</span>
    <span className={styles.pathInfoCurrentPage}>{currentPageName}</span>
  </nav>
);

export default PathInfo;
