import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";
import img from "../../assets/img/hero";
import { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import SignInForm from "../Modal/SignInForm";
import SignUpForm from "../Modal/SignUpForm";
import { selectUser } from "../../redux/slices/usersSlice";

const Hero = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleAddRecipeButton = () => {
    if (!user) {
      setIsModalOpen(true);
      setShowSignUp(false);
      return;
    }
    navigate("/recipe/add");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSwitchToSignUp = () => {
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
  };

  return (
    <section className={styles["hero-section"]}>
      <div className={styles["hero-wrapper"]}>
        <h1 className={styles.title}>
          Improve Your
          <br />
          Culinary Talents
        </h1>
        <p className={styles.desc}>
          Amazing recipes for beginners in the world of cooking, enveloping you
          in the aromas and tastes of various cuisines.
        </p>
        <button
          className={styles["hero-button"]}
          type="button"
          onClick={handleAddRecipeButton}
        >
          Add Recipe
        </button>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            {showSignUp ? (
              <SignUpForm
                onClose={handleCloseModal}
                onSwitchToSignIn={handleSwitchToSignIn}
              />
            ) : (
              <SignInForm
                onClose={handleCloseModal}
                onSwitchToSignUp={handleSwitchToSignUp}
              />
            )}
          </Modal>
        )}
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
    </section>
  );
};

export default Hero;
