import sprite from "../../assets/img/sprite.svg";
import styles from "./Logo.module.css";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/">
    <svg className={styles.logoIcon} aria-hidden="true">
      <use href={`${sprite}#icon-logo`} />
    </svg>
  </Link>
);

export default Logo;
