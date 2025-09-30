import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/usersSlice";
import LogoutModal from "../Modal/LogoutModal";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import sprite from "../../assets/img/sprite.svg";
import css from "./UserBar.module.css";
import { X } from "lucide-react";
import styles from "../Hero/Hero.module.css";
import img from "../../assets/img/hero";

const UserBar = () => {
  const user = useSelector(selectUser);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className={css.userBarWrapper}>
      <div
        className={css.userBar}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        ref={profileMenuRef}
      >
        <img src={user?.avatar} alt="user avatar" className={css.userAvatar} />
        <span className={css.userName}>{user?.name || "User"}</span>

        <svg
          className={`${css.profileIcon} ${
            isProfileMenuOpen ? css.active : ""
          }`}
        >
          <use href={`${sprite}#icon-chevron-down`}></use>
        </svg>

        {isProfileMenuOpen && (
          <div className={css.profileMenu}>
            <Link className={css.profileMenuItem} to={`/user/${user.id}`}>
              Profile
            </Link>
            <button
              className={`${css.profileMenuItem} ${css.logoutButton}`}
              onClick={() => setIsLogoutOpen(true)}
            >
              Log out
              <svg className={css.logoutIcon}>
                <use href={`${sprite}#icon-arrow`}></use>
              </svg>
            </button>
          </div>
        )}

        <LogoutModal
          isOpen={isLogoutOpen}
          onClose={() => setIsLogoutOpen(false)}
        />
      </div>
      <button
        className={css.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <svg className={css.mobileMenuIcon}>
          <use href={`${sprite}#icon-align-justify`}></use>
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div className={css.mobileMenu}>
          {/* Logo and close button */}
          <div className={css.mobileMenuHeader}>
            <div className={css.mobileMenuLogo}>
              <svg className={css.mobileMenuLogoIcon}>
                <use href={`${sprite}#icon-logo`}></use>
              </svg>
            </div>
            <button
              className={css.mobileMenuCloseButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X />
            </button>
          </div>
          <ul className={css.mobileMenuItems}>
            <li className={css.mobileMenuItem}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className={css.mobileMenuItem}>
              <Link to="/recipe/add" onClick={() => setIsMobileMenuOpen(false)}>
                Add Recipe
              </Link>
            </li>
          </ul>
          <div className={css.mobileMenuFooter}>
            <div className={styles["hero-wrapper-img"]}>
              <div className={styles["hero-img-small"]}>
                <img
                  width="128"
                  src={img.imageSmall1x}
                  srcSet={`${img.imageSmall1x} 1x,
                                    ${img.imageSmall2x} 2x,
                                    ${img.imageSmall2x} 3x`}
                  alt="food"
                />
              </div>
              <div className={styles["hero-img-big"]}>
                <img
                  width="302"
                  src={img.imageBig1x}
                  srcSet={`${img.imageBig1x} 1x,
                                    ${img.imageBig2x} 2x,
                                    ${img.imageBig2x} 3x`}
                  alt="food"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBar;
