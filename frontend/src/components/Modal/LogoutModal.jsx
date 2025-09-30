import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/ops/usersOps";
import styles from "./Modal.module.css";

const LogoutModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
    navigate("/");
  };

  return (
    <div className={`${styles.backdrop} ${styles.authorizationModal}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div className={styles.logoutText}>
          <h2 className={styles.title}>ARE YOU LOGGING OUT?</h2>
          <h2 className={styles.titleMobile}>LOG OUT</h2>
          <p className={styles.text}>You can always log back in at any time.</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          LOG OUT
        </button>
        <button className={styles.cancelBtn} onClick={onClose}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
