import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordInput.module.css";

const PasswordInput = ({
  name = "password",
  placeholder = "Password",
  register,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.passwordtWrapper}>
      <input
        {...register(name)}
        className={styles.input}
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className={styles.toggleBtn}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
