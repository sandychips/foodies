import { NavLink } from "react-router-dom";
import clsx from "clsx";
import css from "./Navigation.module.css";

const buildLinkClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.active);
};

export default function Navigation({ isAuth = false }) {
  if (!isAuth) {
    return null;
  }

  return (
    <nav className={css.nav}>
      <NavLink to="/" className={buildLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/recipe/add" className={buildLinkClass}>
        Add Recipe
      </NavLink>
    </nav>
  );
}
