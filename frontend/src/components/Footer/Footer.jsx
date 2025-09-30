import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import NetworkLinks from "../NetworkLinks/NetworkLinks";
import styles from "./Footer.module.css";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.logoFooter} onClick={handleLogoClick}>
            <Logo />
          </div>
          <NetworkLinks className={styles.networkLinks} />
        </div>
      </div>
      <hr className={styles.divider} />

      <p className={styles.copy}>
        © {new Date().getFullYear()}, Foodies. All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
