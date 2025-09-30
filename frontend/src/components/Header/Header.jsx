import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import AuthBar from "../AuthBar/AuthBar";
import UserBar from "../UserBar/UserBar";
import css from "./Header.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/usersSlice";
import { useLocation } from "react-router-dom";

const Header = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = Boolean(user);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`${css.headerWrapper} container ${
        isHomePage ? "header-dark" : "header-light"
      }`}
    >
      <Logo />
      <Navigation isAuth={isAuthenticated} />
      {isAuthenticated ? <UserBar /> : <AuthBar />}
    </header>
  );
};

export default Header;
